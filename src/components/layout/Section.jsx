/**
 * =============================================================================
 * Section: the shared layout for every regular (non-animated) content section
 * -----------------------------------------------------------------------------
 *   desktop:  [ Heading (sticks while you read) ] [ content ............ ]
 *   mobile:   Heading
 *             content
 *
 * Usage:
 *   <Section id="awards" title="Awards" intro="Optional short line">
 *     <p>...</p>
 *   </Section>
 *
 * `id` is the anchor for links like #awards; the heading gets `${id}-heading`
 * so screen readers announce the section by its title.
 * =============================================================================
 */
export default function Section({ id, title, intro, children }) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="py-24 sm:py-36">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
        <header className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2
            id={headingId}
            className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] font-bold tracking-tight"
            style={{ fontStretch: '78%' }}
          >
            {title}
          </h2>
          {intro && <p className="mt-4 max-w-xs text-muted">{intro}</p>}
        </header>

        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
