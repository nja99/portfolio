/**
 * CertificationsSection
 * Certificates and short courses, in the same style as Leadership:
 * title, issuer underneath in grey, year on the right (hidden if blank).
 * If a certification has a link, its title becomes a blue link (↗, new tab).
 * Data: `certifications` in src/data/portfolio.js (new Award(title, issuer, year, url)).
 */
import Section from '../layout/Section.jsx';

export default function CertificationsSection({ certifications }) {
  return (
    <Section id="certifications" title="Certifications">
      <ul className="space-y-8">
        {certifications.map((cert) => (
          <li key={cert.id} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-8">
            <div>
              <p className="text-lg font-medium">{cert.url ? <CertificateLink cert={cert} /> : cert.title}</p>
              {cert.issuer && <p className="text-muted">{cert.issuer}</p>}
            </div>
            {cert.year && <p className="text-sm text-muted tabular-nums sm:pt-1.5 sm:text-right">{cert.year}</p>}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** The certificate title as a link to its verification page. */
function CertificateLink({ cert }) {
  return (
    <a
      href={cert.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-baseline gap-1.5 text-accent underline-offset-4 hover:underline"
    >
      {cert.title}
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
      <span className="sr-only"> (view certificate, opens in a new tab)</span>
    </a>
  );
}
