/**
 * EducationSection
 * Schools on the same scroll-drawn Timeline as Experience.
 * Each school shows its qualification, then clearly labelled rows
 * (Focus areas, Minor, Diploma Plus, Honours, GPA; see Education.rows in
 * Models.js), then selected coursework, which fades in course by course.
 */
import Section from '../layout/Section.jsx';
import Timeline, { reveal } from '../ui/Timeline.jsx';

export default function EducationSection({ education }) {
  return (
    <Section id="education" title="Education">
      <Timeline items={education} renderItem={(school, active) => <School school={school} active={active} />} />
    </Section>
  );
}

function School({ school, active }) {
  return (
    <>
      <p style={reveal(active, 0)} className="text-sm text-muted">
        <time>{school.period}</time>
      </p>
      <h3 style={reveal(active, 1)} className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
        {school.school}
      </h3>
      <p style={reveal(active, 1)} className="mt-1 text-lg">
        {school.qualification}
      </p>
      <Rows rows={school.rows} active={active} />
      <Coursework courses={school.coursework} active={active} startStep={school.rows.length + 2} />
    </>
  );
}

/** Labelled rows: label on the left, value(s) on the right. */
function Rows({ rows, active }) {
  if (rows.length === 0) return null;
  return (
    <dl className="mt-5 space-y-2">
      {rows.map((row, i) => (
        <div key={row.label} style={reveal(active, i + 2)} className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
          <dt className="text-sm text-muted sm:pt-0.5">{row.label}</dt>
          <dd>
            {row.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Coursework grid; courses appear one after another. */
function Coursework({ courses, active, startStep }) {
  if (courses.length === 0) return null;
  return (
    <div className="mt-8">
      <h4 style={reveal(active, startStep)} className="text-base font-semibold">
        Selected coursework
      </h4>
      <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {courses.map((course, i) => (
          <li key={course.id} style={reveal(active, startStep + 1 + i * 0.5)} className="flex gap-4">
            <span className="w-20 shrink-0 text-sm text-muted tabular-nums">{course.code}</span>
            <span>{course.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
