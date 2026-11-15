/**
 * =============================================================================
 * GlobeCanvas: a slowly turning dotted sphere for the hero
 * -----------------------------------------------------------------------------
 * TWO STYLES, chosen with the `variant` prop:
 *   'globe'    connected globe: arcs travel between nodes (described below)
 *   'breathe'  breathing sphere: a slow wave swells across the surface, and the
 *              dots on its crest grow and light up in the accent colour
 *
 * Hundreds of small dots are spread evenly over a sphere (a "Fibonacci
 * sphere"), which turns slowly. A handful of accent "nodes" sit on its surface,
 * and every so often an arc lifts off one node and travels to another, like a
 * message crossing a distributed system, then fades away.
 *
 * Dots on the far side are fainter and smaller, which gives depth without any
 * 3D library: each point is rotated with a little trigonometry, then projected
 * onto the flat canvas with simple perspective.
 *
 * On desktop the globe tilts gently towards the mouse.
 * Colours come from the CSS theme variables and update with the theme.
 * Pauses when off screen or when the tab is hidden.
 * With reduced motion it draws one still frame (with a few fixed arcs).
 *
 * HOW THE COMPONENT IS BUILT
 *   React renders a single <canvas>. One useEffect sets up the animation when
 *   the canvas appears and returns a cleanup function that stops everything
 *   when it goes away. The animation's moving parts (dots, arcs, tilt) live in
 *   plain variables inside that effect, not in React state, because they change
 *   60 times a second and never need React to re-render.
 *
 * Tune the constants below.
 * =============================================================================
 */
import { useEffect, useRef } from 'react';
import { themeService } from '../../services/ThemeService.js';
import { MotionPreference } from '../../services/ScrollService.js';
import { readThemeColors } from '../../hooks/useTheme.js';

const SETTINGS = {
  dots: 1000, // dots on the sphere
  nodes: 14, // accent points that arcs travel between
  maxArcs: 5, // arcs on screen at once
  arcEvery: 650, // ms between new arcs (roughly)
  arcDuration: 2600, // ms for an arc to draw and fade
  arcLift: 0.15, // how high arcs rise above the surface (0–1)
  arcMinAngle: 0.5, // radians: skip node pairs that are too close…
  arcMaxAngle: 1.6, // …or too far apart (near-opposite points make wild arcs)
  spin: 0.00006, // radians per ms (one turn ≈ 1.7 minutes)
  baseTilt: 0.38, // radians: tilt the globe towards the viewer
  pointerTilt: 0.18, // max extra tilt from the mouse
  dotRadius: 1.15, // px, at the front of the globe
  dotAlpha: 0.6, // front dots; back dots fade towards 0.06
  arcAlpha: 0.75,
  perspective: 3, // larger = flatter
  // 'breathe' style only
  waveAmount: 0.14, // how far the wave pushes dots outwards (0–1)
  waveSpeed: 0.0011, // radians per ms (one breath ≈ 6 seconds)
  waveBands: 3.2, // how many swells fit from pole to pole
};

// ---- maths helpers (pure functions, no React) --------------------------------

/** Evenly spaced points on a unit sphere (golden-angle spiral). */
function fibonacciSphere(n) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - ((i + 0.5) / n) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * golden;
    return [Math.cos(a) * r, y, Math.sin(a) * r];
  });
}

/** Rotate a point around the Y axis (spin), then the X axis (tilt). */
function rotate([x, y, z], spin, tilt) {
  const cs = Math.cos(spin);
  const ss = Math.sin(spin);
  [x, z] = [x * cs + z * ss, -x * ss + z * cs];
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  [y, z] = [y * ct - z * st, y * st + z * ct];
  return [x, y, z];
}

/** Angle (radians) between two points on the unit sphere. */
function angleBetween(a, b) {
  return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
}

/** A point part-way along the great circle from a to b, lifted into an arc. */
function arcPoint(a, b, u) {
  const angle = angleBetween(a, b);
  const s = Math.sin(angle) || 1;
  const ka = Math.sin((1 - u) * angle) / s;
  const kb = Math.sin(u * angle) / s;
  // Longer arcs rise a little higher, like flight paths.
  const lift = 1 + SETTINGS.arcLift * Math.sin(Math.PI * u) * (angle / 2 + 0.3);
  return [(a[0] * ka + b[0] * kb) * lift, (a[1] * ka + b[1] * kb) * lift, (a[2] * ka + b[2] * kb) * lift];
}

/** True when an arc between a and b would look good (not too short or wild). */
function goodPair(a, b) {
  const angle = angleBetween(a, b);
  return angle > SETTINGS.arcMinAngle && angle < SETTINGS.arcMaxAngle;
}

// ---- component ----------------------------------------------------------------

export default function GlobeCanvas({ variant = 'globe', className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const S = SETTINGS;
    const reduced = MotionPreference.reduced;
    const breathing = variant === 'breathe';

    // Animation state: plain variables, private to this effect.
    const dots = fibonacciSphere(S.dots);
    // Node positions come from the dot grid so they sit exactly on the surface.
    const nodes = Array.from({ length: S.nodes }, () => dots[Math.floor(Math.random() * dots.length)]);
    let arcs = [];
    let size = { w: 0, h: 0 };
    let colors = readThemeColors();
    const tilt = { target: 0, current: 0 };
    let frame = 0;
    let visible = true;
    let lastArc = 0;

    /** Project a rotated 3D point onto the canvas. Returns [x, y, scale]. */
    const project = ([x, y, z], radius) => {
      const k = S.perspective / (S.perspective + z);
      return [size.w / 2 + x * radius * k, size.h / 2 + y * radius * k, k];
    };

    /** Occasionally start a new arc between two different nodes. */
    const spawnArc = (time) => {
      arcs = arcs.filter((arc) => time - arc.start < S.arcDuration);
      const due = time - lastArc > S.arcEvery * (0.6 + Math.random() * 0.8);
      if (!due || arcs.length >= S.maxArcs) return;
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const b = nodes[Math.floor(Math.random() * nodes.length)];
      if (!goodPair(a, b)) return;
      arcs.push({ a, b, start: time });
      lastArc = time;
    };

    /** Globe style: dots, then arcs, then the nodes on the front half. */
    const drawGlobe = (time, spin, t, radius) => {
      // 1. Dots: depth runs 0 (back) → 1 (front)
      ctx.fillStyle = colors.muted;
      for (const p of dots) {
        const q = rotate(p, spin, t);
        const depth = (1 - q[2]) / 2;
        const [x, y, k] = project(q, radius);
        ctx.globalAlpha = 0.06 + (S.dotAlpha - 0.06) * depth * depth;
        ctx.beginPath();
        ctx.arc(x, y, S.dotRadius * k * (0.6 + 0.4 * depth), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Arcs: the head draws out over the first 60%, the tail follows behind
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      for (const arc of arcs) {
        const u = (time - arc.start) / S.arcDuration; // 0 → 1
        const head = Math.min(1, u / 0.6);
        const tail = Math.max(0, (u - 0.4) / 0.6);
        // Segment by segment, so parts behind the globe are fainter.
        let prev = null;
        for (let v = tail; v <= head + 1e-6; v += 0.025) {
          const q = rotate(arcPoint(arc.a, arc.b, Math.min(v, head)), spin, t);
          const [x, y] = project(q, radius);
          if (prev) {
            ctx.globalAlpha = S.arcAlpha * (q[2] > 0 ? 0.25 : 1);
            ctx.beginPath();
            ctx.moveTo(prev[0], prev[1]);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
          prev = [x, y];
        }
      }

      // 3. Nodes: only those on the front half, so they don't show through
      ctx.fillStyle = colors.accent;
      for (const p of nodes) {
        const q = rotate(p, spin, t);
        if (q[2] > 0.15) continue;
        const [x, y, k] = project(q, radius);
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2.4 * k, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /**
     * Breathing style: each dot is pushed outwards by a wave that travels from
     * pole to pole (it depends on the dot's height, p[1], and on time). Dots
     * near the top of the wave are larger and drawn in the accent colour.
     */
    const drawBreathing = (time, spin, t, radius) => {
      const r = radius * 0.92; // leave room for the swell
      for (const p of dots) {
        const wave = Math.sin(time * S.waveSpeed - p[1] * S.waveBands); // -1 → 1
        const swell = 1 + S.waveAmount * wave;
        const q = rotate([p[0] * swell, p[1] * swell, p[2] * swell], spin, t);
        const depth = Math.min(1, Math.max(0, (1 - q[2] / swell) / 2));
        const [x, y, k] = project(q, r);
        const crest = Math.max(0, (wave - 0.55) / 0.45); // 0, rising to 1 on the crest
        ctx.fillStyle = crest > 0 ? colors.accent : colors.muted;
        ctx.globalAlpha = (0.06 + (S.dotAlpha - 0.06) * depth * depth) * (crest > 0 ? 0.6 + 0.6 * crest : 1);
        ctx.beginPath();
        ctx.arc(x, y, S.dotRadius * k * (0.6 + 0.4 * depth) * (1 + 0.7 * crest), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = (time) => {
      if (!size.w) return;
      const radius = Math.min(size.w, size.h) * 0.4;
      // Ease the tilt towards the mouse target, so it never jumps.
      tilt.current += (tilt.target - tilt.current) * 0.04;
      const spin = time * S.spin;
      const t = S.baseTilt + tilt.current;

      ctx.clearRect(0, 0, size.w, size.h);
      if (breathing) drawBreathing(time, spin, t, radius);
      else drawGlobe(time, spin, t, radius);
      ctx.globalAlpha = 1;
    };

    const loop = (time) => {
      if (!breathing) spawnArc(time);
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const restart = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden && !reduced) frame = requestAnimationFrame(loop);
    };

    /** Match the canvas to its box (sharp on high-DPI screens). */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      size = { w: width, h: height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(0);
    };

    /** Mouse position → a small tilt target (-1..1 across the screen height). */
    const onPointer = (e) => {
      tilt.target = (e.clientY / window.innerHeight - 0.5) * 2 * S.pointerTilt;
    };

    // ---- set up ----
    if (reduced && !breathing) {
      // A few fixed, fully drawn arcs so the still frame isn't empty.
      for (let i = 0; i < nodes.length && arcs.length < 3; i++) {
        const a = nodes[i];
        const b = nodes[(i + 5) % nodes.length];
        if (goodPair(a, b)) arcs.push({ a, b, start: -S.arcDuration * 0.5 });
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const unsubscribeTheme = themeService.subscribe(() => {
      colors = readThemeColors();
      if (reduced) draw(0);
    });

    // Stop animating while the hero is scrolled away.
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      restart();
    });
    intersection.observe(canvas);
    document.addEventListener('visibilitychange', restart);
    const hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hasMouse && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });
    restart();

    // ---- clean up when the canvas goes away ----
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', restart);
      window.removeEventListener('pointermove', onPointer);
      unsubscribeTheme();
    };
  }, [variant]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
