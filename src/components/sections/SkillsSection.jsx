/**
 * SkillsSection
 * A definition list: group name on the left, skills on the right.
 * Plain text rather than "pill" chips keeps it calm and scannable.
 */
import Section from '../layout/Section.jsx';

export default function SkillsSection({ skills }) {
  return (
    <Section id="skills" title="Skills">
      <dl className="space-y-1">
        {skills.map((group) => (
          <div key={group.id} className="grid gap-2 py-6 sm:grid-cols-[11rem_1fr] sm:gap-8">
            <dt className="font-semibold">{group.label}</dt>
            <dd className="text-lg">{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
