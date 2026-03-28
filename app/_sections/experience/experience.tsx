import { SectionLabel } from "@/app/_components/section-label";
import { ArrowLink } from "@/components/ArrowLink";
import { ExperienceEntry, getNumber, getOptionalString, getSectionEntries, getString, getStringArray } from "@/lib/section-content";

export function Experience(): React.JSX.Element {
  const experiences = getSectionEntries<ExperienceEntry>("experience", ({ slug, data }) => ({
    slug,
    order: getNumber(data, "order"),
    period: getString(data, "period"),
    role: getString(data, "role"),
    company: getString(data, "company"),
    url: getString(data, "url"),
    subtitle: getOptionalString(data, "subtitle"),
    description: getString(data, "description"),
    stack: getStringArray(data, "stack"),
  }));

  return (
    <section className="space-y-7">
      <SectionLabel>Experience</SectionLabel>
      <ul className="space-y-16">
        {experiences.map((experience) => (
          <li key={experience.slug}>
            <p className="text-sm dark:text-cadet-gray text-gray">{experience.period}</p>

            <ArrowLink target="_blank" href={experience.url}>
              {experience.role} &#183; {experience.company}
            </ArrowLink>

            {experience.subtitle && <p>{experience.subtitle}</p>}

            <p className="mt-3 mb-5 text-sm dark:text-cadet-gray text-gray">{experience.description}</p>

            <ul className="flex flex-wrap gap-4">
              {experience.stack.map((stack) => (
                <li key={stack}>
                  <div className="dark:text-light-sea-green dark:bg-jet bg-light-sea-green text-seasalt flex items-center gap-1 rounded-full border px-3 py-2 text-xs transition-all">
                    <span>{stack}</span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
