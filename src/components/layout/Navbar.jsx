/**
 * Navbar: fixed at the top.
 *  - Left: the logo (links back to the top).
 *  - Tablet and up (≥768px): section links + Résumé + theme toggle.
 *  - Phone: theme toggle + "Menu" (Résumé is the last item in the menu).
 * The "Résumé" link (top right, and in the phone menu) opens `resume`
 * (profile.resume in portfolio.js) in a new tab. Pass resume='' to hide it.
 * Also includes a "Skip to content" link for keyboard and screen-reader users.
 * To add a nav link, add an entry to LINKS (the id must match a section).
 */
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import Logo from '../ui/Logo.jsx';

const LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ name, resume }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Escape closes the mobile menu (only listens while it is open).
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-accent px-5 py-3 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Backdrop with no divider: a soft blur that fades out downwards,
            so the bar melts into the page instead of sitting on top of it.
            (The fade is a mask on this layer only, never on the links.) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -bottom-6 bg-bg/75 backdrop-blur-md"
          style={{
            maskImage: 'linear-gradient(to bottom, black 55%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent)',
          }}
        />
        <nav aria-label="Main" className="container-page relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* `group` lets the logo's hover animation react to this link */}
            <a href="#top" aria-label={`${name}, back to top`} className="group -m-1 rounded-lg p-1">
              <Logo size={30} />
            </a>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <ul className="hidden items-center gap-7 whitespace-nowrap md:flex">
              <NavLinks className="text-fg transition-colors hover:text-accent" />
            </ul>
            {resume && <ResumeLink href={resume} />}
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="min-h-11 rounded-full px-4 text-accent md:hidden"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        {menuOpen && (
          <ul id="mobile-menu" className="container-page relative bg-bg pt-2 pb-6 shadow-[0_24px_24px_-12px_var(--bg)] md:hidden">
            <NavLinks className="block py-3 text-2xl font-semibold" onClick={closeMenu} />
            {resume && (
              <li>
                <a href={resume} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="block py-3 text-2xl font-semibold text-accent">
                  Résumé
                  <span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </li>
            )}
          </ul>
        )}
      </header>
    </>
  );
}

function NavLinks({ className, onClick }) {
  return LINKS.map((link) => (
    <li key={link.href}>
      <a href={link.href} onClick={onClick} className={className}>
        {link.label}
      </a>
    </li>
  ));
}

/** Blue text link in line with the other links: accent colour marks it as
 *  the one action; the small arrow means "opens in a new tab". */
function ResumeLink({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group hidden items-center gap-1 font-medium whitespace-nowrap text-accent underline-offset-4 hover:underline md:ml-3 md:inline-flex"
    >
      Résumé
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
        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
      <span className="sr-only"> (PDF, opens in a new tab)</span>
    </a>
  );
}
