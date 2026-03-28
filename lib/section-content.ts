import { FrontmatterRecord, parseFrontmatter, readFrontmatterFilesSync } from "@/lib/frontmatter";
import path from "node:path";

export interface BaseEntry {
  slug: string;
  order: number;
}

export interface ExperienceEntry extends BaseEntry {
  period: string;
  role: string;
  company: string;
  url: string;
  subtitle?: string;
  description: string;
  stack: string[];
}

export interface WritingEntry extends BaseEntry {
  title: string;
  tags: string[];
  date: string;
  description: string;
  href: string;
  image?: string;
}

export interface ProjectEntry extends BaseEntry {
  title: string;
  url: string;
  description: string;
  image: string;
}

interface ParsedWritingFile {
  chapter: string;
  slug: string;
  data: FrontmatterRecord;
  content: string;
}

function getContentDirectory(section: string): string {
  return path.join(process.cwd(), "app", "_sections", section, "content");
}

export function getString(data: FrontmatterRecord, key: string): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing or invalid '${key}' in frontmatter`);
  }
  return value;
}

export function getOptionalString(data: FrontmatterRecord, key: string): string | undefined {
  const value = data[key];
  if (typeof value !== "string") {
    return undefined;
  }
  return value;
}

export function getNumber(data: FrontmatterRecord, key: string): number {
  const value = data[key];
  if (typeof value !== "number") {
    throw new Error(`Missing or invalid '${key}' in frontmatter`);
  }
  return value;
}

export function getStringArray(data: FrontmatterRecord, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Missing or invalid '${key}' in frontmatter`);
  }
  return value;
}

interface ParsedSectionFile {
  slug: string;
  data: FrontmatterRecord;
}

export function getSectionEntries<T extends BaseEntry>(section: string, mapEntry: (entry: ParsedSectionFile) => T): T[] {
  const directory = getContentDirectory(section);
  const items = readFrontmatterFilesSync({
    directory,
    extensions: [".md"],
  }).map((entry) =>
    mapEntry({
      slug: entry.slug,
      data: entry.data,
    }),
  );

  return items.sort((a, b) => a.order - b.order);
}

export function getWritingEntries<T extends BaseEntry>(mapEntry: (entry: ParsedWritingFile) => T | null): T[] {
  const directory = path.join(process.cwd(), "writing");
  const items = readFrontmatterFilesSync({
    directory,
    extensions: [".md", ".mdx"],
    recursive: true,
  })
    .map((entry) => {
      const [chapter, ...slugParts] = entry.slug.split("/");
      const slug = slugParts.join("/");

      if (!chapter || !slug) {
        return null;
      }

      return mapEntry({
        chapter,
        slug,
        data: entry.data,
        content: parseFrontmatter(entry.content).content,
      });
    })
    .filter((entry): entry is T => entry !== null);

  return items.sort((a, b) => a.order - b.order);
}
