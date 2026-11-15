/**
 * Button: a link styled as a button. Accent colour = "you can click this",
 * which is the only job the accent does on this site.
 *
 * Props:
 *   href      where it goes
 *   variant   'solid' (filled accent) | 'outline' (accent border)
 *   external  open in a new tab (adds rel="noopener" for security)
 */
const VARIANTS = {
  solid: 'bg-accent text-bg hover:opacity-90',
  outline: 'border border-accent text-accent hover:bg-accent hover:text-bg',
};

const BASE =
  'inline-flex min-h-11 items-center justify-center rounded-full px-6 text-base font-medium transition-colors duration-200';

export default function Button({ href, variant = 'solid', external = false, children }) {
  return (
    <a
      href={href}
      className={`${BASE} ${VARIANTS[variant]}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
