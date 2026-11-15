/**
 * =============================================================================
 * ProjectsScene: project panels that scroll sideways
 * -----------------------------------------------------------------------------
 * Projects are ALWAYS shown sideways:
 *
 *  • Tablets and up (≥ 768px): the stage pins and scrolling DOWN slides the
 *    panels SIDEWAYS. The track height is calculated from how wide the row is,
 *    so adding a project automatically lengthens the scroll.
 *    If the window is short, the whole row is scaled down slightly (to no less
 *    than MIN_SCALE) so the panels still fit on screen.
 *
 *  • Phones, very short windows, or reduced motion: a native sideways row you
 *    swipe (or scroll with a trackpad / Shift + wheel), snapping card by card.
 *    No scroll-jacking, which feels bad on touch screens.
 * =============================================================================
 */
import { useRef, useState } from 'react';
import ScrollScene from '../layout/ScrollScene.jsx';
import ProjectCard from '../ui/ProjectCard.jsx';

/** Width (px) from which the pinned sideways scroll is used. Tailwind `md`. */
const WIDE_BREAKPOINT = 768;

/** Smallest the panels may shrink to fit a short window (0.72 = 72%). */
const MIN_SCALE = 0.72;

/** Height of the fixed nav plus breathing room (px). */
const NAV_SPACE = 64 + 40;

/** Same left/right padding as the page container, so cards line up with text. */
const ROW_PADDING =
  'px-5 sm:px-8 md:px-[max(2rem,calc((100vw-88rem)/2+2rem))] lg:px-[max(3rem,calc((100vw-88rem)/2+3rem))] 2xl:px-[max(4rem,calc((100vw-88rem)/2+4rem))]';

const INITIAL_LAYOUT = {
  isWide: typeof window !== 'undefined' && window.innerWidth >= WIDE_BREAKPOINT,
  scale: 1, // how much the row is shrunk to fit the window height
  rowHeight: 0, // natural (unscaled) height of the row, px
  fits: true, // false when even MIN_SCALE is not enough
  distance: 0, // how far (px) the row needs to travel sideways
};

/** True when two layouts differ enough to be worth a re-render. */
function layoutChanged(a, b) {
  return (
    a.isWide !== b.isWide ||
    a.fits !== b.fits ||
    Math.abs(a.scale - b.scale) > 0.005 ||
    Math.abs(a.rowHeight - b.rowHeight) > 1 ||
    Math.abs(a.distance - b.distance) > 1
  );
}

export default function ProjectsScene({ projects }) {
  const rowRef = useRef(null);
  const wrapRef = useRef(null); // holds the side padding, so scaling never shrinks it
  const headerRef = useRef(null);
  const [layout, setLayout] = useState(INITIAL_LAYOUT);

  /** Re-measure layout on scroll/resize (cheap reads only). */
  const measure = () => {
    const isWide = window.innerWidth >= WIDE_BREAKPOINT;
    const row = rowRef.current;
    const header = headerRef.current;

    // Measurements only exist while the pinned layout is on screen.
    if (!row || !header || !isWide) {
      setLayout((prev) => (isWide !== prev.isWide || (!isWide && !prev.fits) ? { ...prev, isWide, fits: true } : prev));
      return;
    }

    // offsetHeight/scrollWidth ignore CSS transforms, so these are natural sizes.
    const rowHeight = row.offsetHeight;
    const available = window.innerHeight - NAV_SPACE - header.offsetHeight - 32;
    const scale = Math.min(1, available / rowHeight);
    const fits = scale >= MIN_SCALE;
    const pad = getComputedStyle(wrapRef.current);
    const sidePadding = parseFloat(pad.paddingLeft) + parseFloat(pad.paddingRight);
    const distance = Math.max(0, row.scrollWidth * scale + sidePadding - window.innerWidth);

    const next = { isWide, fits, scale, rowHeight, distance };
    setLayout((prev) => (layoutChanged(prev, next) ? next : prev));
  };

  const { isWide, fits, scale, rowHeight, distance } = layout;

  return (
    <ScrollScene
      id="projects"
      label="Projects"
      // Track = one screen + the sideways distance, so 1px down = 1px across.
      trackHeight={`calc(100svh + ${distance}px)`}
      isStatic={!isWide || !fits}
      onMeasure={measure}
      renderStatic={() => <SwipeRow projects={projects} />}
    >
      {(progress) => (
        <div className="flex h-full flex-col justify-center gap-8 pt-16">
          <Header ref={headerRef} progress={progress} />

          {/* Wrapper: page padding + the SCALED height, so the layout stays
              centred and the first card lines up with the heading. */}
          <div ref={wrapRef} className={ROW_PADDING} style={{ height: rowHeight ? rowHeight * scale : undefined }}>
            <ul
              ref={rowRef}
              className="flex w-max origin-top-left gap-6 will-change-transform"
              style={{ transform: `translate3d(${-progress * distance}px,0,0) scale(${scale})` }}
            >
              {projects.map((project) => (
                <li key={project.id} className="w-[min(46rem,78vw)] shrink-0 lg:w-[min(46rem,64vw)]">
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </ScrollScene>
  );
}

/**
 * Heading, intro line and (when pinned) a small bar showing how far through
 * the projects you are. React 19 lets function components take `ref` as a
 * normal prop, so the scene can measure the header's height.
 */
function Header({ ref, progress }) {
  return (
    <div ref={ref} className="container-page">
      <div className="flex items-end justify-between gap-8">
        <div>
          <h2
            className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-bold tracking-tight"
            style={{ fontStretch: '78%' }}
          >
            Projects
          </h2>
          <p className="mt-3 max-w-md text-muted">Selected work across the web, desktop and mobile.</p>
        </div>

        {/* Scroll position through the projects (decorative). */}
        {progress !== null && (
          <div aria-hidden="true" className="hidden h-0.5 w-40 overflow-hidden rounded-full bg-muted/25 md:block">
            <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${progress})` }} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Swipeable sideways row (phones, very short windows, reduced motion). */
function SwipeRow({ projects }) {
  return (
    <div className="py-24 sm:py-36">
      <Header progress={null} />
      <ul
        tabIndex={0}
        aria-label="Projects. Scroll sideways to see more."
        className={`mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 ${ROW_PADDING} scroll-px-5 sm:scroll-px-8 [scrollbar-width:thin]`}
      >
        {projects.map((project) => (
          <li key={project.id} className="w-[85vw] max-w-[40rem] shrink-0 snap-start">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <p className="container-page mt-3 text-sm text-muted md:hidden">Swipe to see more</p>
    </div>
  );
}
