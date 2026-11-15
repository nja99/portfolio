/**
 * LeadershipSection
 * Leadership roles, volunteering and co-curricular activities (as short
 * bullet points), newest first, followed by a short list of non-academic
 * awards. Academic honours (Director's List, Distinction, etc.) are shown
 * with each school in EducationSection instead.
 * Data: `leadership` and `awards` in src/data/portfolio.js.
 */
import Section from '../layout/Section.jsx';

export default function LeadershipSection({ leadership, awards = [] }) {
  return (
    <Section id="leadership" title="Leadership & Volunteering">
      <Roles leadership={leadership} />
      <Awards awards={awards} />
    </Section>
  );
}

function Roles({ leadership }) {
  return (
    <ul className="space-y-10">
      {leadership.map((item) => (
        <li key={item.id} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-8">
          <div>
            <p className="text-lg font-medium">{item.role}</p>
            <p className="text-muted">{item.organisation}</p>
            {item.points.length > 0 && (
              <ul className="mt-3 max-w-prose space-y-1.5 text-muted">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-muted" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {item.period && <p className="text-sm text-muted tabular-nums sm:pt-1.5 sm:text-right">{item.period}</p>}
        </li>
      ))}
    </ul>
  );
}

function Awards({ awards }) {
  if (awards.length === 0) return null;
  return (
    <div className="mt-12">
      <h3 className="text-base font-semibold">Awards</h3>
      <ul className="mt-3 space-y-2">
        {awards.map((award) => (
          <li key={award.id}>
            {award.title}
            {(award.issuer || award.year) && (
              <span className="text-muted">
                {', '}
                {[award.issuer, award.year].filter(Boolean).join(', ')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
