/**
 * =============================================================================
 * StatementScene: your "about" text, pinned to the screen
 * -----------------------------------------------------------------------------
 * Each word starts faint and lights up in turn as you scroll, like Apple's
 * product-page reveals.
 *
 * The text comes from profile.statement in src/data/portfolio.js. Separate
 * paragraphs with a blank line ("\n\n"):
 *   • the FIRST paragraph is set large, as a headline
 *   • any FOLLOWING paragraphs are set smaller, as supporting text
 * The reveal flows through all paragraphs in order.
 *
 * Screen readers get the whole text at once (the animated words are
 * aria-hidden and a visually-hidden copy is provided).
 * =============================================================================
 */
import ScrollScene from '../layout/ScrollScene.jsx';
import { ScrollService } from '../../services/ScrollService.js';

const { range } = ScrollService;

/** Opacity of a word that has not been reached yet. */
const DIM = 0.18;

/** Type styles: headline (first paragraph) and supporting text (the rest). */
const HEADLINE =
  'max-w-[30ch] text-[clamp(1.6rem,min(3.6vw,5vh),3.5rem)] leading-[1.1] font-semibold tracking-tight';
const SUPPORT =
  'mt-[min(5vh,3rem)] max-w-[50ch] text-[clamp(1.1rem,min(2.1vw,3.1vh),2rem)] leading-[1.4] font-medium';

/** Headline is set slightly narrow; supporting text at normal width. */
const paragraphStyle = (p) => ({ fontStretch: p === 0 ? '82%' : '100%' });

export default function StatementScene({ profile }) {
  // The statement split into paragraphs (blank-line separated).
  const paragraphs = profile.statement.split(/\n\s*\n/).map((p) => p.trim());

  return (
    <ScrollScene
      id="about"
      label="About me"
      trackHeight="250vh"
      renderStatic={() => (
        <div className="container-page py-24">
          {paragraphs.map((text, p) => (
            <p key={p} className={p === 0 ? HEADLINE : SUPPORT} style={paragraphStyle(p)}>
              {text}
            </p>
          ))}
        </div>
      )}
    >
      {(progress) => <Reveal paragraphs={paragraphs} progress={progress} />}
    </ScrollScene>
  );
}

/** The word-by-word reveal for a given scroll progress (0..1). */
function Reveal({ paragraphs, progress }) {
  const words = paragraphs.map((p) => p.split(' '));
  const total = words.reduce((n, list) => n + list.length, 0);

  // Reveal starts almost immediately (2%) and finishes at 80%, leaving a
  // short pause at the end so the full text can be read.
  const reveal = range(progress, 0.02, 0.8);

  let index = 0; // running word count across paragraphs
  return (
    <div className="container-page flex h-full flex-col justify-center pt-16">
      <p className="sr-only">{paragraphs.join(' ')}</p>
      {words.map((list, p) => (
        <p key={p} aria-hidden="true" className={p === 0 ? HEADLINE : SUPPORT} style={paragraphStyle(p)}>
          {list.map((word) => {
            // Each word owns a small slice of the reveal; it fades in across it.
            const i = index++;
            const t = range(reveal, i / total, (i + 1) / total);
            return (
              <span key={i} style={{ opacity: DIM + (1 - DIM) * t }}>
                {word}{' '}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
