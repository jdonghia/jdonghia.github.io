import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import { highlight } from "sugar-high";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type OrderedListProps = ComponentPropsWithoutRef<"ol">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type ImageProps = ComponentPropsWithoutRef<typeof Image>;

function getLanguageLabel(language: string): string {
  const aliases: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    shell: "sh",
    bash: "sh",
  };

  return aliases[language] ?? language;
}

export const components = {
  h1: ({ className, ...props }: HeadingProps) => (
    <h1
      {...props}
      className={cn("text-black dark:text-seasalt scroll-m-20 text-5xl font-extrabold tracking-tight text-balance", className)}
    />
  ),

  h2: ({ className, ...props }: HeadingProps) => (
    <h2
      {...props}
      className={cn(
        "text-eerie-black dark:border-cadet-gray dark:text-seasalt mt-16 scroll-m-20 pb-2 text-3xl font-semibold tracking-tight",
        className,
      )}
    />
  ),

  h3: ({ className, ...props }: HeadingProps) => (
    <h3
      {...props}
      className={cn("text-eerie-black dark:text-seasalt mt-16 scroll-m-20 text-2xl font-semibold tracking-tight", className)}
    />
  ),

  h4: ({ className, ...props }: HeadingProps) => (
    <h4 {...props} className={cn("dark:text-seasalt text-eerie-black mt-16 scroll-m-20 text-xl font-semibold tracking-tight", className)} />
  ),

  p: ({ className, ...props }: ParagraphProps) => <p {...props} className={cn("my-6 leading-7", className)} />,

  ul: ({ className, ...props }: ListProps) => <ul {...props} className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} />,

  ol: ({ className, ...props }: OrderedListProps) => <ol {...props} className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} />,

  b: (props: ComponentPropsWithoutRef<"b">) => <b className="font-medium text-eerie-black dark:text-seasalt" {...props} />,
  li: (props: ListItemProps) => <li className="pl-1" {...props} />,
  em: (props: ComponentPropsWithoutRef<"em">) => <em className="font-medium" {...props} />,
  strong: (props: ComponentPropsWithoutRef<"strong">) => <strong className="font-medium" {...props} />,
  a: ({ href, children, ...props }: AnchorProps) => {
    const className =
      "text-eerie-black underline dark:text-seasalt hover:dark:text-light-sea-green hover:text-light-sea-green dark:underline dark:underline-offset-2";
    if (href?.startsWith("/")) {
      return (
        <Link href={href} className={className} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props}>
        {children}
      </a>
    );
  },
  pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => {
    const children: any = props.children as React.ReactElement;
    const language = children.props.className?.replace(/language-/, "") ?? "";
    const languageLabel = getLanguageLabel(language);

    return (
      <div className="my-6">
        {language && (
          <div className="code-header">
            <span>.{languageLabel}</span>
          </div>
        )}
        <pre
          {...props}
          className={cn(!language && "leading-4 rounded-md", "p-6 font-jet-brains-mono rounded-b-md bg-jet overflow-x-auto", className)}
        />
      </div>
    );
  },
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<"code">) => {
    const language = className?.replace(/language-/, "") ?? "";
    if (language) {
      const codeHTML = highlight(children as string);
      return <code className={cn("font-jet-brains-mono", className)} dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
    }
    return (
      <code className={cn("font-jet-brains-mono", className)} {...props}>
        {children}
      </code>
    );
  },
  img: ({ className, alt, ...props }: ImageProps) => (
    <span className="block my-16">
      <Image width={Number(50)} height={Number(50)} alt={alt ?? ""} className={cn("w-full", className)} {...props} />
      {/* <span className="text-center text-sm mt-3 block"> */}
      {/*   source:{" "} */}
      {/*   <HoverLink target="_blank" href={alt}> */}
      {/*     {alt} */}
      {/*   </HoverLink> */}
      {/* </span> */}
    </span>
  ),
  blockquote: (props: BlockquoteProps) => (
    <blockquote className="ml-[0.075em] border-l-3 border-gray-300 pl-4 text-gray-700 dark:border-zinc-600 dark:text-zinc-300" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className=" w-full overflow-x-auto my-6">
      <table {...props} className={cn("w-full text-nowrap", props.className)} />
    </div>
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => <tr {...props} className={cn("border-b border-gray", props.className)} />,
  th: (props: ComponentPropsWithoutRef<"th">) => <th {...props} className={cn("p-2 text-left", props.className)} />,
  td: (props: ComponentPropsWithoutRef<"td">) => <td {...props} className={cn("p-2 text-sm", props.className)} />,
};
