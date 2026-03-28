import { parseFrontmatter, readFrontmatterFiles, resolveExistingFrontmatterPath } from "@/lib/frontmatter";
import { promises as fs } from "fs";
import path from "path";

const WRITING_EXTENSIONS = [".mdx", ".md"] as const;

// Define the shape of a single article's metadata.
// This ensures type safety throughout your application.
export interface WritingMetadata {
  slug: string;
  title: string;
  subtitle?: string;
  date?: string;
  tags?: string[];
  type: string;
}

const getWritingsFromDir = async (dir: string, type: WritingMetadata["type"]): Promise<WritingMetadata[]> => {
  const writingsDirectory = path.join(process.cwd(), "writing", dir);

  const allWritingsData = (
    await readFrontmatterFiles({
      directory: writingsDirectory,
      extensions: WRITING_EXTENSIONS,
      recursive: true,
    })
  ).map(
    (entry) =>
      ({
        slug: entry.slug,
        title: entry.data.title,
        ...entry.data,
        type,
      }) as WritingMetadata,
  );

  return allWritingsData;
};

/**
 * Reads all MDX files from a specified directory, extracts their frontmatter,
 * and returns the metadata as a sorted array of objects.
 * This function runs on the server.
 *
 * @returns {Promise<WritingMetadata[]>} A promise that resolves to an array of article metadata.
 */
export async function getWritings(): Promise<WritingMetadata[]> {
  // Use a try-catch block to handle potential errors, such as a missing directory.
  try {
    const articles = await getWritingsFromDir("articles", "articles");
    const projects = await getWritingsFromDir("projects", "projects");
    const studies = await getWritingsFromDir("studies", "studies");

    const allWritings = [...articles, ...projects, ...studies];

    // Sort the articles by date, from newest to oldest.
    // The date field must be present in your frontmatter for this to work correctly.
    allWritings.sort((a, b) => {
      // The `!` is a non-null assertion operator, assuming the `date` property exists.
      if (a.date! < b.date!) return 1;
      if (a.date! > b.date!) return -1;
      return 0;
    });

    return allWritings;
  } catch (error) {
    console.error("Error in getWritings function:", error);
    // Return an empty array to prevent the application from crashing.
    return [];
  }
}

export async function getWriting(type: string, slug: string): Promise<{ content: string; frontmatter: any } | null> {
  try {
    const dir = type;
    const basePath = path.join(process.cwd(), "writing", dir);
    const filePath = await resolveExistingFrontmatterPath(basePath, slug, WRITING_EXTENSIONS);

    if (!filePath) {
      return null;
    }

    const fileContents = await fs.readFile(filePath, "utf8");
    const { content, data: frontmatter } = parseFrontmatter(fileContents);

    return { content, frontmatter };
  } catch (error) {
    console.error(`Error in getWriting function for ${type}/${slug}:`, error);
    return null;
  }
}

export interface Chapter {
  title: string;
  subject: string;
  items?: Chapter[];
  date?: string;
}

export async function getChapters(): Promise<Chapter[]> {
  const writings = await getWritings();

  const chapters: Chapter[] = [
    {
      title: "Projects",
      subject: "projects",
      items: [],
    },
    {
      title: "Articles",
      subject: "articles",
      items: [],
    },
    {
      title: "Studies",
      subject: "studies",
      items: [],
    },
  ];

  writings.forEach((writing) => {
    const { type, slug, title } = writing;

    let chapterSubject: string;
    switch (type) {
      case "study":
        chapterSubject = "studies";
        break;
      default:
        chapterSubject = type;
        break;
    }

    const chapter = chapters.find((c) => c.subject === chapterSubject);
    if (!chapter) return;

    let currentLevel = chapter.items!;
    const parts = slug.split("/");

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        currentLevel.push({ title, subject: part, date: writing.date });
      } else {
        let nextLevel = currentLevel.find((item) => item.subject === part);
        if (!nextLevel) {
          const parentTitle = part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          nextLevel = { title: parentTitle, subject: part, items: [] };
          currentLevel.push(nextLevel);
        }
        currentLevel = nextLevel.items!;
      }
    });
  });

  const sortChapterItems = (items: Chapter[]): Chapter[] => {
    items.sort((a, b) => a.title.localeCompare(b.title));
    items.forEach((item) => {
      if (item.items) {
        sortChapterItems(item.items);
      }
    });
    return items;
  };

  chapters.forEach((chapter) => {
    if (chapter.items) {
      sortChapterItems(chapter.items);
    }
  });

  const projectsChapter = chapters.find((c) => c.subject === "projects");
  if (projectsChapter && projectsChapter.items) {
    projectsChapter.items.sort((a, b) => {
      const aIsPresent = a.date?.includes("present");
      const bIsPresent = b.date?.includes("present");

      if (aIsPresent && !bIsPresent) return -1;
      if (!aIsPresent && bIsPresent) return 1;

      if (a.date! < b.date!) return 1;
      if (a.date! > b.date!) return -1;
      return 0;
    });
  }

  return chapters.filter((chapter) => chapter.items && chapter.items.length > 0);
}
