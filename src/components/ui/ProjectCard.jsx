/**
 * ProjectCard: one project panel. Receives a `Project` model instance.
 * The title is set narrow and heavy (fontStretch 72%) to echo the hero.
 */
import Button from './Button.jsx';

export default function ProjectCard({ project }) {
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-muted/30 bg-bg/60 p-6 backdrop-blur-[2px] sm:p-8">
      <p className="text-sm text-muted">
        {project.period}
        <span className="mx-2" aria-hidden="true">/</span>
        {project.role}
      </p>

      <h3
        className="mt-3 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-none font-extrabold tracking-tight"
        style={{ fontStretch: '72%' }}
      >
        {project.title}
      </h3>

      <p className="mt-4 max-w-prose text-[1.05rem]">{project.summary}</p>

      <ul className="mt-5 space-y-2 text-[0.95rem] text-muted">
        {project.highlights.map((point) => (
          <li key={point} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-muted" />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <Stack groups={project.stackGroups()} />

        {project.links.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <Button key={link.id} href={link.href} variant="outline" external={link.isExternal}>
                {link.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Tech stack as a fixed three-row breakdown, identical on every project
 * (rows come from Project.STACK_LAYERS in Models.js):
 *   Frontend   [Flutter] [Dart]
 *   Backend    [Firebase] [Google Cloud]
 *   Tools      [CI/CD]
 * Labels are muted; each technology is an outlined chip; an empty row says
 * "Not needed" so every panel keeps the same shape.
 */
function Stack({ groups }) {
  if (groups.length === 0) return null;
  return (
    <dl aria-label="Tech stack" className="grid grid-cols-[5.5rem_1fr] items-center gap-x-4 gap-y-2.5 pt-2">
      {groups.map((group) => (
        <div key={group.label} className="contents">
          <dt className="text-sm text-muted">{group.label}</dt>
          <dd className="flex min-h-7 flex-wrap items-center gap-1.5">
            {group.items.length === 0 && <span className="text-sm text-muted">Not needed</span>}
            {group.items.map((item) => (
              <span key={item} className="rounded-full border border-muted/35 px-3 py-0.5 text-sm leading-6">
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
