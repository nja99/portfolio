/**
 * =============================================================================
 * TestimonialsSection: quotes from people you've worked with, as cards
 * -----------------------------------------------------------------------------
 *   [ “Quote…”                ] [ “Quote…”                ]
 *   [ ───────────────         ] [ ───────────────         ]
 *   [ (LT) Name               ] [ (AB) Name               ]
 *   [      Role               ] [      Role               ]
 *   [      Organisation       ] [      Organisation       ]
 *
 * Laid out like Projects: the heading and a short line on top, the cards in
 * a row underneath. At most 2 cards side by side (tablets and up), 1 on
 * phones. A single card on a wide screen takes half the width, so its lines
 * stay easy to read. Change MAX_CARDS to show more side by side.
 *
 * When there are MORE cards than fit, the row slides along by itself, one
 * card every SLIDE_MS, looping back to the start after the last. Unlike
 * Projects, scrolling the page never moves it: it runs on its own timer.
 *
 * HOW THE TIMING WORKS
 *   The active dot holds a thin bar that fills up over SLIDE_MS (a CSS
 *   animation, `testimonial-progress` in index.css). When the fill finishes,
 *   the row slides on. Pausing simply pauses that animation, so the bar
 *   always shows exactly how long is left.
 *
 * CONTROLS
 *   No buttons: it runs by itself. The dots show progress and can be clicked
 *   to jump, and you can swipe on touch screens.
 *
 * ACCESSIBILITY
 *   • Pauses while the mouse is over the cards or something inside has
 *     keyboard focus, and while the section is off screen.
 *   • Never moves on its own if the visitor has turned on "reduce motion".
 *   • Cards that are slid out of view are hidden from screen readers and
 *     can't be tabbed into.
 *
 * Data: `testimonials` in src/data/portfolio.js. Hidden if the list is empty.
 * =============================================================================
 */
import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../../hooks/useReducedMotion.js';

/** How long the row rests before sliding one card along (ms). */
const SLIDE_MS = 7000;

/** How far (px) a finger must swipe to slide. */
const SWIPE_PX = 50;

/** Most cards shown side by side. */
const MAX_CARDS = 2;

/** Space between cards. Used in both the CSS gap and the slide maths. */
const GAP = '1.5rem';

/** How many cards fit side by side at the current window width. */
function useCardsPerView() {
  const read = () => (window.innerWidth >= 768 ? MAX_CARDS : 1);
  const [perView, setPerView] = useState(read);
  useEffect(() => {
    const onResize = () => setPerView(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return perView;
}

export default function TestimonialsSection({ testimonials }) {
  const perView = useCardsPerView();
  if (testimonials.length === 0) return null;

  const visible = Math.min(perView, testimonials.length);
  const positions = testimonials.length - visible + 1; // how many places the row can slide to

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="py-24 sm:py-36">
      <div className="container-page">
        {/* Same heading style as Projects */}
        <h2
          id="testimonials-heading"
          className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-bold tracking-tight"
          style={{ fontStretch: '78%' }}
        >
          Testimonials
        </h2>
        <p className="mt-3 max-w-md text-muted">What people I’ve worked with say.</p>

        <div className="mt-10 sm:mt-14">
          {positions > 1 ? (
            <Carousel testimonials={testimonials} visible={visible} positions={positions} />
          ) : (
            // Everything fits: no sliding. A lone card takes at most half the width.
            <Row testimonials={testimonials} visible={perView} index={0} />
          )}
        </div>
      </div>
    </section>
  );
}

/** The row of cards, shifted left by `index` cards. */
function Row({ testimonials, visible, index, animate = false }) {
  return (
    <div
      className="flex"
      style={{
        gap: GAP,
        // Each step moves by one card width plus one gap.
        transform: `translateX(calc(${index} * (100% + ${GAP}) / ${visible} * -1))`,
        transition: animate ? 'transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1)' : 'none',
      }}
    >
      {testimonials.map((t, i) => {
        const offScreen = i < index || i >= index + visible;
        return (
          <div
            key={t.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`Testimonial ${i + 1} of ${testimonials.length}`}
            aria-hidden={offScreen}
            inert={offScreen}
            className="shrink-0"
            style={{ width: `calc((100% - ${GAP} * ${visible - 1}) / ${visible})` }}
          >
            <Card testimonial={t} />
          </div>
        );
      })}
    </div>
  );
}

function Carousel({ testimonials, visible, positions }) {
  const rootRef = useRef(null);
  const swipeStart = useRef(null);
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  const autoplay = !reduced; // slides by itself unless the visitor asked for less motion
  const running = autoplay && !hovered && !focused && onScreen; // sliding right now?
  const current = Math.min(index, positions - 1); // stay in range if the window is resized

  // Only slide while the section is on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  const goTo = (i) => setIndex(((i % positions) + positions) % positions); // wrap around both ways
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Swipe on touch screens: compare where the finger went down and came up.
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') swipeStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (dx <= -SWIPE_PX) next();
    else if (dx >= SWIPE_PX) prev();
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      // Pause for keyboard focus only (a mouse click on a button shouldn't freeze it)
      onFocus={(e) => e.target.matches(':focus-visible') && setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      <div
        className="-my-4 overflow-hidden py-4" // room for the cards' soft edges
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: 'pan-y' }}
      >
        <Row testimonials={testimonials} visible={visible} index={current} animate={!reduced} />
      </div>

      {/* Progress dots: the active one fills up until the next slide */}
      <div className="mt-8 flex items-center gap-1">
        {Array.from({ length: positions }, (_, i) => (
          <Dot
            key={i}
            active={i === current}
            label={`Show testimonials from ${i + 1}`}
            onClick={() => goTo(i)}
            autoplay={autoplay}
            running={running}
            onDone={next}
          />
        ))}
      </div>

      {/* Tells screen readers where the row is, without announcing every auto-slide */}
      <p className="sr-only" aria-live={autoplay ? 'off' : 'polite'}>
        Showing testimonial {current + 1}
        {visible > 1 ? ` to ${current + visible}` : ''} of {testimonials.length}
      </p>
    </div>
  );
}

/**
 * A position dot. The active one is wider; while auto-playing it holds a bar
 * that fills over SLIDE_MS and calls onDone when full.
 */
function Dot({ active, label, onClick, autoplay, running, onDone }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-current={active} className="group grid h-11 place-items-center px-1">
      <span
        className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
          active ? 'w-10 bg-muted/30' : 'w-1.5 bg-muted/40 group-hover:bg-muted/70'
        }`}
      >
        {active && (
          <span
            className="absolute inset-0 origin-left rounded-full bg-fg"
            style={
              autoplay
                ? { animation: `testimonial-progress ${SLIDE_MS}ms linear forwards`, animationPlayState: running ? 'running' : 'paused' }
                : undefined
            }
            onAnimationEnd={onDone}
          />
        )}
      </span>
    </button>
  );
}

/** First letters of the first two words: "Louis Tee" → "LT". */
const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** One testimonial card: quote, a divider, then who said it. */
function Card({ testimonial: t }) {
  return (
    <figure className="flex h-full flex-col rounded-[1.75rem] border border-muted/30 bg-bg/60 p-6 backdrop-blur-[2px] sm:p-8">
      {/* Opening quote mark (decorative) on the left, the year on the right,
          like the dates in Certifications and Leadership */}
      <div className="flex items-start justify-between gap-4">
        <svg width="26" height="20" viewBox="0 0 34 26" aria-hidden="true" className="shrink-0 text-muted/60">
          <path
            fill="currentColor"
            d="M0 26V15.6C0 6.6 4.6 1.4 13.4 0l1.4 3.6C9.6 5 7.2 8.2 7 12.6h6.6V26H0Zm19.2 0V15.6C19.2 6.6 23.8 1.4 32.6 0L34 3.6c-5.2 1.4-7.6 4.6-7.8 9h6.6V26H19.2Z"
          />
        </svg>
        {t.year && <p className="text-sm text-muted tabular-nums">{t.year}</p>}
      </div>

      <blockquote className="mt-5 text-[1.05rem] leading-relaxed">
        <p>{t.quote}</p>
      </blockquote>

      {/* mt-auto pushes the footer to the bottom, so every card lines up */}
      <figcaption className="mt-auto pt-8">
        <div className="mb-6 h-px bg-muted/25" />
        <div className="flex items-center gap-4">
          <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-muted/10 text-sm font-semibold tracking-wide">
            {initials(t.name)}
          </span>
          <div className="min-w-0">
            {/* One fact per line: name, role, organisation */}
            <p className="font-medium">{t.url ? <SourceLink testimonial={t} /> : t.name}</p>
            <p className="text-sm">{t.role}</p>
            <p className="text-sm text-muted">{t.organisation}</p>
            {t.relationship && <p className="text-sm text-muted">{t.relationship}</p>}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

/** The name as a link to the original testimonial (e.g. on LinkedIn). */
function SourceLink({ testimonial: t }) {
  return (
    <a
      href={t.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-baseline gap-1.5 text-accent underline-offset-4 hover:underline"
    >
      {t.name}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 self-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      <span className="sr-only"> (view original, opens in a new tab)</span>
    </a>
  );
}