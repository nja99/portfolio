/**
 * ExperienceSection
 * Jobs on a scroll-drawn Timeline, newest first. As the line reaches each
 * job, its dates, title, company and bullet points rise in one after another.
 * Entries with `compact: true` (minor or older roles, e.g. a side venture)
 * get a small dot and a single low-emphasis line.
 */
import Section from '../layout/Section.jsx';
import Timeline, { reveal } from '../ui/Timeline.jsx';

export default function ExperienceSection({ experience }) {
  return (
    <Section id="experience" title="Experience">
      <Timeline
        items={experience}
        marker={(job) => (job.compact ? 'small' : 'dot')}
        renderItem={(job, active) =>
          job.compact ? <CompactJob job={job} active={active} /> : <Job job={job} active={active} />
        }
      />
    </Section>
  );
}

/** Full entry. Each element gets the next stagger step (0, 1, 2 ...). */
function Job({ job, active }) {
  return (
    <>
      <p style={reveal(active, 0)} className="text-sm text-muted">
        <time>{job.period}</time>
        {job.isCurrent && <span className="sr-only"> (current role)</span>}
      </p>
      <h3 style={reveal(active, 1)} className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
        {job.role}
      </h3>
      <p style={reveal(active, 1)} className="mt-1 text-lg">
        {job.company}
      </p>
      <ul className="mt-5 max-w-prose space-y-2.5 text-muted">
        {job.points.map((point, i) => (
          // Dash bullet, same style as Projects and Leadership
          <li key={point} style={reveal(active, i + 2)} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-muted" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Small, low-emphasis entry for a minor role. */
function CompactJob({ job, active }) {
  return (
    <div style={reveal(active, 0)} className="text-sm text-muted">
      <p>
        <time>{job.period}</time>
        <span aria-hidden="true">{'  /  '}</span>
        {job.company}, {job.role.toLowerCase()}
      </p>
      <p className="mt-1 max-w-prose">{job.points.join(' ')}</p>
    </div>
  );
}
