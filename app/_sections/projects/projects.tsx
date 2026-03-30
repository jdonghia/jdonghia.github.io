import { SectionLabel } from "@/app/_components/section-label";
import { ArrowLink } from "@/components/ArrowLink";
import { getNumber, getSectionEntries, getString, ProjectEntry } from "@/lib/section-content";
import Image from "next/image";

export function Projects(): React.JSX.Element {
  const projects = getSectionEntries<ProjectEntry>("projects", ({ slug, data }) => ({
    slug,
    order: getNumber(data, "order"),
    title: getString(data, "title"),
    url: getString(data, "url"),
    description: getString(data, "description"),
    image: getString(data, "image"),
  }));

  return (
    <section className="space-y-7 text-sm">
      <SectionLabel>Side Projects</SectionLabel>
      <ul className="space-y-8">
        {projects.map((project) => (
          <li key={project.slug} className="flex gap-5 rounded">
            {/* <Image */}
            {/*   src="" */}
            {/*   aria-hidden="true" */}
            {/*   className="border border-gray rounded w-36 h-20" */}
            {/*   height={50} */}
            {/*   width={50} */}
            {/* /> */}
            <div>
              <ArrowLink className="text-[1rem]" href={project.url} id={project.slug} target="_blank" rel="noopener noreferrer">
                {project.title}
              </ArrowLink>
              <p className="mt-1 text-sm">{project.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
