import { SectionLabel } from "@/app/_components/section-label";
import { ArrowLink } from "@/components/ArrowLink";
import { getNumber, getOptionalString, getString, getStringArray, getWritingEntries, WritingEntry } from "@/lib/section-content";
import { cn } from "@/lib/utils";
import Image from "next/image";

function getFirstParagraph(content: string): string {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  const firstParagraph = paragraphs.find(
    (paragraph) => !paragraph.startsWith("#") && !paragraph.startsWith("```") && !paragraph.startsWith("!["),
  );

  if (!firstParagraph) {
    return "";
  }

  return firstParagraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[\*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }

  return `${text.slice(0, length).trimEnd()}...`;
}

function getDateValue(date: string): number {
  const value = Date.parse(`1 ${date}`);
  return Number.isNaN(value) ? 0 : value;
}

export function Dashboard(): React.JSX.Element {
  const writing = getWritingEntries<WritingEntry>(({ chapter, slug, data, content }) => {
    if (typeof data.order !== "number") {
      return null;
    }

    const paragraph = getFirstParagraph(content);

    return {
      slug,
      order: getNumber(data, "order"),
      title: getString(data, "title"),
      tags: getStringArray(data, "tags"),
      date: getString(data, "date"),
      description: truncateText(paragraph, 80),
      href: `/${chapter}/${slug}`,
      image: getOptionalString(data, "image"),
    };
  });
  const cards = [...writing]
    .sort((a, b) => getDateValue(b.date) - getDateValue(a.date))
    .slice(0, 3)
    .map((entry) => ({
      ...entry,
      hasImage: !!entry.image,
    }));

  return (
    <section className="space-y-7">
      <SectionLabel>Recent Writing</SectionLabel>

      <div className="max-w-2xl sm:grid sm:grid-cols-12 sm:grid-rows-1 sm:auto-rows-fr sm:gap-4">
        {cards.map((entry) => (
          <div
            className={cn(
              "max-sm:max-w-[340px] dark:bg-jet w-full rounded-md border border-gray max-sm:my-5 sm:col-span-6 h-full",
              entry.hasImage ? "flex flex-col rounded-lg bg-white sm:row-span-2" : "bg-seasalt sm:row-span-1",
            )}
            key={entry.slug}
          >
            {entry.hasImage ? (
              <Image
                alt=""
                className="max-sm:h-32 sm:min-h-54 max-h-54 w-full rounded-t-lg bg-cover object-cover"
                src={entry.image ?? ""}
                height={50}
                width={50}
              />
            ) : null}

            <div className="px-3 py-5 flex h-full flex-col">
              <div className="ms-1">
                <p className="text-xs mb-2">{entry.date}</p>
                <ArrowLink href={entry.href} className="text-lg">
                  {entry.title}
                </ArrowLink>
              </div>

              <p className={cn("ms-1 mt-2 mb-3 flex-1 text-sm", entry.hasImage && "line-clamp-2")}>{entry.description}</p>

              <div className="flex items-center gap-2 mt-auto">
                {entry.tags.map((tag) => (
                  <p
                    key={tag}
                    className="dark:text-light-sea-green dark:bg-jet bg-light-sea-green text-seasalt my-2 inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs"
                  >
                    {tag}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
