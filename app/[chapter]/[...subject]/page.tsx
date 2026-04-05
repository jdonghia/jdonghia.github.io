import { Comments } from "@/components/Comments";
import MdxContent from "@/components/MdxContent";
import { components } from "@/components/Typography";
import { getWriting, getWritings } from "@/lib/writings";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

const { h1: H1, h3: H3 } = components;

export async function generateStaticParams() {
  const writings = await getWritings();

  return writings.map((writing) => ({
    chapter: writing.type,
    subject: writing.slug.split("/"),
  }));
}

interface ParamsProps {
  chapter: string;
  subject: string[];
}

export default async function Page({ params }: { params: Promise<ParamsProps> }) {
  const { chapter, subject } = await params;

  const writing = await getWriting(chapter, subject.join("/"));

  if (!writing) {
    return;
  }

  const { title, subtitle, date, tags } = writing.frontmatter;

  const mdxSource = await serialize(writing.content, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return (
    <div className="space-y-24">
      <article>
        <div className="mb-16">
          <p className="text-sm mb-5">{date}</p>
          <H1 className="my-0">{title}</H1>
          <H3 className="mt-2 text-2xl pb-3 border-b">{subtitle}</H3>
          {tags && (
            <ul className="mt-4 flex mb-10 flex-wrap gap-2">
              {tags?.map((tag: string) => (
                <li
                  key={tag}
                  className="dark:text-light-sea-green dark:bg-jet bg-light-sea-green text-seasalt block rounded-full px-3 py-2 text-xs"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <MdxContent source={mdxSource} />
      </article>
      <Comments />
    </div>
  );
}
