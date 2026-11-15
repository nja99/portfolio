/**
 * =============================================================================
 * NetworkCanvas: the "network" background (used by BackgroundFX)
 * -----------------------------------------------------------------------------
 * A slow constellation: small nodes drift across the screen, and a faint line
 * appears between any two nodes that come close, like a network forming and
 * re-forming. On desktop, nodes near the mouse link to it in the accent colour.
 *
 * Drawn on a <canvas> for performance. Colours are read from the CSS theme
 * variables and refreshed when the theme changes. Pauses when the tab is
 * hidden. With reduced motion it draws one still frame.
 *
 * Like GlobeCanvas, all the moving parts live inside one useEffect, which
 * returns a cleanup function that stops the animation.
 *
 * Tune the constants below (lower alpha = subtler).
 * =============================================================================
 */
import { useEffect, useRef } from 'react';
import { themeService } from '../../services/ThemeService.js';
import { MotionPreference } from '../../services/ScrollService.js';
import { readThemeColors } from '../../hooks/useTheme.js';

const SETTINGS = {
  density: 1 / 16000, // nodes per px² of screen
  maxNodes: 110,
  speed: 0.12, // px per frame (slow)
  linkDistance: 130, // px: nodes closer than this get a line
  pointerDistance: 170, // px: nodes this close to the mouse link to it
  nodeRadius: 1.8,
  nodeAlpha: 0.6,
  lineAlpha: 0.28,
  pointerAlpha: 0.5,
  lineWidth: 1.2, // px
  pointerLineWidth: 1.4, // px
};

/** Fade the network out towards the bottom of the screen. */
const FADE = 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)';

export default function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const S = SETTINGS;
    const reduced = MotionPreference.reduced;

    let nodes = [];
    let pointer = null;
    let frame = 0;
    let colors = readThemeColors();

    /** Match the canvas to the screen (sharp on high-DPI) and reseed nodes. */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(S.maxNodes, Math.round(w * h * S.density));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2 * S.speed,
        vy: (Math.random() - 0.5) * 2 * S.speed,
      }));
      if (reduced) draw();
    };

    /** Move every node; bounce softly off the screen edges. */
    const step = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lines between nearby nodes (fainter the further apart)
      ctx.strokeStyle = colors.muted;
      ctx.lineWidth = S.lineWidth;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < S.linkDistance) {
            ctx.globalAlpha = S.lineAlpha * (1 - d / S.linkDistance);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Links from the mouse to nearby nodes, in the accent colour
      if (pointer) {
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = S.pointerLineWidth;
        for (const n of nodes) {
          const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (d < S.pointerDistance) {
            ctx.globalAlpha = S.pointerAlpha * (1 - d / S.pointerDistance);
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      ctx.fillStyle = colors.muted;
      ctx.globalAlpha = S.nodeAlpha;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, S.nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (e) => {
      pointer = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      pointer = null;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) loop();
    };

    // ---- set up ----
    resize();
    window.addEventListener('resize', resize);
    const unsubscribeTheme = themeService.subscribe(() => {
      colors = readThemeColors();
      if (reduced) draw();
    });
    if (!reduced) {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.addEventListener('pointermove', onPointer, { passive: true });
        document.addEventListener('pointerleave', onLeave);
      }
      document.addEventListener('visibilitychange', onVisibility);
      loop();
    }

    // ---- clean up ----
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      unsubscribeTheme();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ maskImage: FADE, WebkitMaskImage: FADE }} />;
}
