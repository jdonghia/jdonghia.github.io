import matter from "gray-matter";
import fs, { promises as fsPromises } from "node:fs";
import path from "node:path";

export interface FrontmatterRecord {
  [key: string]: unknown;
}

export interface FrontmatterFile {
  slug: string;
  filePath: string;
  data: FrontmatterRecord;
  content: string;
}

interface ReadFrontmatterOptions {
  directory: string;
  extensions: readonly string[];
  recursive?: boolean;
  ignorePrefix?: string;
}

function normalizeExtensions(extensions: readonly string[]): string[] {
  return extensions.map((extension) => (extension.startsWith(".") ? extension : `.${extension}`));
}

export function parseFrontmatter(content: string): {
  content: string;
  data: FrontmatterRecord;
} {
  const parsed = matter(content);

  return {
    content: parsed.content,
    data: parsed.data as FrontmatterRecord,
  };
}

function hasSupportedExtension(fileName: string, extensions: readonly string[]): boolean {
  return normalizeExtensions(extensions).some((extension) => fileName.endsWith(extension));
}

export function stripSupportedExtension(value: string, extensions: readonly string[]): string {
  const escapedExtensions = normalizeExtensions(extensions)
    .map((extension) => extension.replace(".", "\\."))
    .join("|");

  return value.replace(new RegExp(`(${escapedExtensions})$`), "");
}

function shouldIncludeFile(fileName: string, extensions: readonly string[], ignorePrefix: string): boolean {
  return hasSupportedExtension(fileName, extensions) && !fileName.startsWith(ignorePrefix);
}

function toFrontmatterFile(filePath: string, rootDirectory: string, extensions: readonly string[]): FrontmatterFile {
  const content = fs.readFileSync(filePath, "utf8");
  const { data } = parseFrontmatter(content);
  const slug = stripSupportedExtension(path.relative(rootDirectory, filePath), extensions);

  return {
    slug,
    filePath,
    data: data as FrontmatterRecord,
    content,
  };
}

export function readFrontmatterFilesSync({
  directory,
  extensions,
  recursive = false,
  ignorePrefix = "_",
}: ReadFrontmatterOptions): FrontmatterFile[] {
  return readFrontmatterFilesSyncFromDirectory(directory, directory, extensions, recursive, ignorePrefix);
}

function readFrontmatterFilesSyncFromDirectory(
  directory: string,
  rootDirectory: string,
  extensions: readonly string[],
  recursive: boolean,
  ignorePrefix: string,
): FrontmatterFile[] {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  const files = entries.flatMap((entry): FrontmatterFile[] => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!recursive) {
        return [];
      }

      return readFrontmatterFilesSyncFromDirectory(fullPath, rootDirectory, extensions, recursive, ignorePrefix);
    }

    if (!entry.isFile()) {
      return [];
    }

    if (!shouldIncludeFile(entry.name, extensions, ignorePrefix)) {
      return [];
    }

    return [toFrontmatterFile(fullPath, rootDirectory, extensions)];
  });

  return files;
}

async function readFrontmatterFilesFromDirectory(
  directory: string,
  rootDirectory: string,
  extensions: readonly string[],
  recursive: boolean,
  ignorePrefix: string,
): Promise<FrontmatterFile[]> {
  const entries = await fsPromises.readdir(directory, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry): Promise<FrontmatterFile[]> => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (!recursive) {
          return [];
        }

        return readFrontmatterFilesFromDirectory(fullPath, rootDirectory, extensions, recursive, ignorePrefix);
      }

      if (!entry.isFile()) {
        return [];
      }

      if (!shouldIncludeFile(entry.name, extensions, ignorePrefix)) {
        return [];
      }

      const content = await fsPromises.readFile(fullPath, "utf8");
      const { data } = parseFrontmatter(content);
      const slug = stripSupportedExtension(path.relative(rootDirectory, fullPath), extensions);

      return [
        {
          slug,
          filePath: fullPath,
          data: data as FrontmatterRecord,
          content,
        },
      ];
    }),
  );

  return files.flat();
}

export async function readFrontmatterFiles({
  directory,
  extensions,
  recursive = false,
  ignorePrefix = "_",
}: ReadFrontmatterOptions): Promise<FrontmatterFile[]> {
  return readFrontmatterFilesFromDirectory(directory, directory, extensions, recursive, ignorePrefix);
}

export async function resolveExistingFrontmatterPath(
  directory: string,
  slug: string,
  extensions: readonly string[],
): Promise<string | null> {
  const normalizedSlug = stripSupportedExtension(slug, extensions);

  for (const extension of normalizeExtensions(extensions)) {
    const candidatePath = path.join(directory, `${normalizedSlug}${extension}`);

    try {
      await fsPromises.access(candidatePath);
      return candidatePath;
    } catch {
      continue;
    }
  }

  return null;
}
