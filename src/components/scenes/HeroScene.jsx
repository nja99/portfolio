/**
 * =============================================================================
 * HeroScene: the first screen
 * -----------------------------------------------------------------------------
 * Your name on ONE line at a fixed width, your title under it, two buttons and
 * the quick facts (profile.facts), with the dotted globe behind.
 *
 * The name itself never moves or changes size. The only scroll effect is a
 * gentle hand-over: while the stage is pinned, the whole hero fades and lifts
 * slightly as the next scene arrives.
 *
 * Timeline (progress 0 → 1):
 *   0.15 – 1.00  stage fades out and lifts slightly
 *
 * Change NAME_SIZE / NAME_STYLE to restyle the name.
 * =============================================================================
 */
import { useRef, useState } from 'react';
import ScrollScene from '../layout/ScrollScene.jsx';
import { ScrollService } from '../../services/ScrollService.js';
import Button from '../ui/Button.jsx';
import FactIcon from '../ui/FactIcon.jsx';
import GlobeCanvas from '../ui/GlobeCanvas.jsx';

const { range, lerp } = ScrollService;

/** Fits "Ng Jian An" on one line from phones to desktops. */
const NAME_SIZE = 'text-[clamp(2.6rem,10.4vw,11.5rem)]';

/** Fixed name styling: normal width, heavy. It does not animate.
 *  fontStretch: 100% = normal width; above 100% = wider, below = narrower. */
const NAME_STYLE = { fontStretch: '100%', fontWeight: 850, letterSpacing: '-0.02em' };

/** The sphere behind the hero (ui/GlobeCanvas.jsx):
 *  'globe' (connected arcs) | 'breathe' (breathing sphere) | 'none' */
const HERO_VISUAL = 'globe';

/** Where the globe sits: right side, slightly off the edge, behind the text.
 *  On phones it is smaller and sits higher, behind the name. */
const GLOBE_POSITION =
  'pointer-events-none absolute top-[30%] -right-[38vw] h-[min(100vw,60vh)] w-[min(100vw,60vh)] -translate-y-1/2 opacity-50 ' +
  'sm:-right-[12vw] sm:opacity-100 md:top-1/2 md:-right-[6vw] md:h-[min(62vw,92vh)] md:w-[min(62vw,92vh)]';

export default function HeroScene({ profile }) {
  // Points at the hero's content so we can check it fits on screen.
  const contentRef = useRef(null);
  const [fits, setFits] = useState(true);

  // Only pin when the content fits on one screen (plus room for the nav).
  // On short phones the hero simply scrolls instead of being cut off.
  const checkFit = () => {
    const el = contentRef.current;
    if (el) setFits(el.offsetHeight + 96 <= window.innerHeight);
  };

  const content = (
    <div ref={contentRef} className="container-page relative">
      {/* The name, always on a single line, with your title under it */}
      <h1 className={`${NAME_SIZE} leading-[0.95] whitespace-nowrap`} style={NAME_STYLE}>
        {profile.name}
      </h1>
      <Role role={profile.role} availability={profile.availability} />
      <Actions email={profile.email} />
      <Facts facts={profile.facts} />
    </div>
  );

  return (
    <ScrollScene
      id="top"
      label="Introduction"
      trackHeight="125vh"
      isStatic={!fits}
      onMeasure={checkFit}
      // Reduced-motion / short-screen version: same content, no pinning.
      renderStatic={() => (
        <div className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-24 pb-16">
          <HeroVisual />
          {content}
        </div>
      )}
    >
      {(progress) => {
        const exit = range(progress, 0.15, 1); // 0 → 1
        const stageStyle = {
          opacity: 1 - exit,
          transform: `translateY(${lerp(0, -6, exit)}vh)`,
        };
        return (
          <div className="relative flex h-full flex-col justify-center pt-16" style={stageStyle}>
            <HeroVisual />
            {content}
          </div>
        );
      }}
    </ScrollScene>
  );
}

/** The dotted sphere (ui/GlobeCanvas.jsx), behind everything in the hero. */
function HeroVisual() {
  if (HERO_VISUAL === 'none') return null;
  return <GlobeCanvas variant={HERO_VISUAL} className={GLOBE_POSITION} />;
}

/** Your title, directly under the name (reads like a business card). */
function Role({ role, availability }) {
  return (
    <>
      <p className="mt-5 text-xl text-muted sm:mt-7 sm:text-2xl">{role}</p>
      {/* Availability (from profile.availability), small and quiet */}
      {availability && <p className="mt-2 text-sm text-muted sm:text-base">{availability}</p>}
    </>
  );
}

/** The two buttons under your title, aligned right on tablets and up. */
function Actions({ email }) {
  return (
    <div className="mt-12 flex flex-wrap gap-3 sm:mt-16 md:justify-end">
      <Button href="#projects" variant="solid">
        View projects
      </Button>
      <Button href={`mailto:${email}`} variant="outline">
        Email me
      </Button>
    </div>
  );
}

/** Quick facts: 4 panels in a row on large screens, 2×2 on tablets,
    stacked on phones. Each fact can have several lines (Fact.lines). */
function Facts({ facts }) {
  if (facts.length === 0) return null;
  return (
    // Each fact sits on a soft frosted panel (no borders): icon + label,
    // then the main line in full colour and supporting lines muted.
    <dl className="mt-12 grid gap-3 sm:mt-16 sm:grid-cols-2 xl:grid-cols-[1fr_1.3fr_1.45fr_1fr]">
      {facts.map((fact) => (
        <div key={fact.id} className="rounded-2xl bg-muted/[0.07] px-5 py-4 backdrop-blur-sm sm:py-5">
          <dt className="flex items-center gap-2 text-sm text-muted">
            <FactIcon name={fact.icon} />
            {fact.label}
          </dt>
          <dd className="mt-2.5 text-[0.95rem] leading-snug">
            {fact.lines.map((line, i) => (
              // First line emphasised; later lines muted unless fact.equal
              <span
                key={line}
                className={`block ${i > 0 ? 'mt-0.5' : ''} ${i === 0 || fact.equal ? 'font-medium' : 'text-muted'}`}
              >
                {line}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
