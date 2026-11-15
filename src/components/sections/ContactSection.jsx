/**
 * =============================================================================
 * ContactSection
 * -----------------------------------------------------------------------------
 *   desktop:  [ Heading, message, Email + Copy buttons ] [ contact details ]
 *   mobile:   stacked
 * followed by the footer (logo and copyright).
 *
 * The section is at least one screen tall, with its content centred and the
 * footer pinned to the bottom, so the last screen of the page shows only
 * "Get in touch" and nothing from the section above.
 *
 * Its layout differs from the standard two-column sections, so it doesn't use
 * the shared Section layout. The "Copy email" button confirms for 2 seconds
 * after copying.
 * =============================================================================
 */
import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button.jsx';
import Logo from '../ui/Logo.jsx';

/** How long the "Email copied" confirmation stays (ms). */
const COPIED_MS = 2000;

export default function ContactSection({ profile }) {
  const headingId = 'contact-heading';

  return (
    // At least one full screen tall, so scrolling to the end shows ONLY this
    // section: the content sits in the middle and the footer at the bottom.
    // (pt-24 leaves room for the fixed nav; -scroll-mt-20 cancels the usual
    // gap left above sections, so the Contact link lands on the full screen.)
    <section id="contact" aria-labelledby={headingId} className="-scroll-mt-20 flex min-h-svh flex-col pt-24 pb-10">
      <div className="container-page flex flex-1 flex-col">
        <div className="my-auto grid gap-12 py-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2
              id={headingId}
              className="text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-tight"
              style={{ fontStretch: '72%' }}
            >
              Get in touch
            </h2>
            <p className="mt-6 max-w-lg text-lg sm:text-xl">
              I’m open to software engineering and technical product management roles across all domains. If you’re
              hiring, or would like to talk about building great products, I’d be glad to hear from you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`mailto:${profile.email}`} variant="solid">
                Email me
              </Button>
              <CopyEmailButton email={profile.email} />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-3">
            <Details profile={profile} />
          </div>
        </div>

        <Footer name={profile.name} />
      </div>
    </section>
  );
}

/** Copies the email to the clipboard and briefly shows a confirmation. */
function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  // Clear any pending timer if the component goes away.
  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Clipboard can be blocked (old browsers, some embeds); the address is
      // still visible on the page, so nothing else is needed.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent px-6 font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-bg"
      >
        {copied ? 'Email copied' : 'Copy email'}
      </button>
      {/* Announces the confirmation to screen readers */}
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </>
  );
}

/** The rows on the right: label + value (links where it makes sense). */
function Details({ profile }) {
  const strip = (url) => url.replace(/^https?:\/\/(www\.)?/, '');
  const rows = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    ...profile.links.map((l) => ({ label: l.label, value: strip(l.href), href: l.href, external: true })),
    ...(profile.resume ? [{ label: 'Résumé', value: 'View PDF', href: profile.resume, external: true }] : []),
    { label: 'Based in', value: profile.location },
  ];

  return (
    <dl className="space-y-1">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
          <dt className="text-muted">{row.label}</dt>
          <dd className="min-w-0 break-words">
            {row.href ? (
              <a className="link" href={row.href} {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {row.value}
                {row.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Footer({ name }) {
  return (
    <footer className="flex flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-center gap-3">
        <Logo size={24} />
        <span>
          © {new Date().getFullYear()} {name}. Built with React and Tailwind CSS.
        </span>
      </p>
    </footer>
  );
}