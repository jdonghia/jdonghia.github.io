"use client"

import { useHeadsObserver } from "@/hooks/useIntersectionObserver"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

interface Section {
  id: string
  title: string
  level: number
  subSections?: Section[]
}

export const TableOfContents = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const clickInProgress = useRef(false);
  const headings = useMemo(
    () =>
      sections
        .flatMap((section) => [
          section.id,
          ...(section.subSections?.map((sub) => sub.id) || []),
        ])
        .filter(Boolean),
    [sections],
  );
  const { activeId, setActiveId } = useHeadsObserver(headings);

  useEffect(() => {
    const headingElements = Array.from(
      document.querySelectorAll("h2, h3"),
    ) as HTMLElement[];

    const newSections: Section[] = [];
    let currentH2: Section | null = null;
    const slugCounts: { [key: string]: number } = {};

    for (const heading of headingElements) {
      const title = heading.innerText;
      let slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

      if (slugCounts[slug]) {
        slugCounts[slug]++;
        slug = `${slug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 1;
      }

      heading.id = slug;

      if (heading.tagName === "H2") {
        const newSection: Section = {
          id: slug,
          title: title,
          level: 1,
          subSections: [],
        };
        newSections.push(newSection);
        currentH2 = newSection;
      } else if (heading.tagName === "H3" && currentH2) {
        currentH2.subSections?.push({
          id: slug,
          title: title,
          level: 2,
        });
      }
    }

    setSections(newSections);
  }, []);

  useEffect(() => {
    if (activeId) {
      const element = document.getElementById(`toc-item-${activeId}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [activeId]);


  const scrollTo = useCallback(
    (id: string) => {
      clickInProgress.current = true;
      setActiveId(id);
      const element = document.getElementById(id);
      if (element) {
        const position = element.getBoundingClientRect();
        window.scrollTo({
          top: position.top + window.scrollY - 110,
        });
      }
      setTimeout(() => {
        clickInProgress.current = false;
      }, 1000);
    },
    [setActiveId],
  );

  if (sections.length === 0) {
    return null;
  }

  const flatSections = sections.reduce((acc, section) => {
    acc.push(section);
    if (section.subSections) {
      acc.push(...section.subSections);
    }
    return acc;
  }, [] as Section[]);


  return (
    <section className="w-[220px]">
      <h4 className="text-light-sea-green mb-5 font-bold">Table Of Contents</h4>
      <ul className="overflow-auto max-h-[calc(90vh-12rem)]">
        {flatSections.map((section) => (
          <li
            key={section.id}
            id={`toc-item-${section.id}`}
            onClick={() => scrollTo(section.id)}
            className={cn(
              "hover:bg-jet mb-1 cursor-pointer rounded px-2 py-1 text-nowrap transition-all",
              section.level === 2 && "ps-4", // Indent level 2
              section.id === activeId
                ? "bg-light-sea-green text-seasalt dark:bg-jet dark:text-light-sea-green"
                : "hover:text-seasalt",
            )}
          >
            {section.title.length > 22
              ? section.title.slice(0, 22) + "..."
              : section.title}
          </li>
        ))}
      </ul>
    </section>
  );
};
