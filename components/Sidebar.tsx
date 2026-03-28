"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Chapter } from "@/lib/writings";

const ChapterItem = ({ item, parentPath }: { item: Chapter; parentPath: string }) => {
  const params = useParams();
  const currentPath = `${parentPath}/${item.subject}`;

  const isDirectory = item.items && item.items.length > 0;

  const isActive = params.subject && Array.isArray(params.subject) && `/${params.chapter}/${params.subject.join("/")}` === currentPath;

  return (
    <li key={item.title}>
      {isDirectory ? (
        <p className="dark:text-seasalt mt-4 ps-2 text-jet">{item.title}</p>
      ) : (
        <Link
          href={currentPath}
          className={cn(
            "hover:bg-jet mt-2 block cursor-pointer rounded px-2 py-1 text-nowrap transition-all",
            isActive
              ? "bg-light-sea-green text-seasalt dark:bg-jet dark:text-light-sea-green"
              : "hover:text-seasalt"
          )}
        >
          {item.title.length > 25
            ? item.title.slice(0, 25) + "..."
            : item.title}
        </Link>
      )}

      {isDirectory && (
        <ul className="mt-1 w-full ps-4">
          {item.items!.map((child) => (
            <ChapterItem key={child.title} item={child} parentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  );
};

export function Sidebar({ chapters }: { chapters: Chapter[] }) {
  return (
    <section className="w-[220px] max-lg:mx-auto lg:ms-auto">
      <nav>
        {chapters.map((sidebarItem: Chapter) => (
          <div className="mb-5" key={sidebarItem.title}>
            <p className="text-light-sea-green font-bold">
              {sidebarItem.title}
            </p>
            <ul className="mt-2">
              {sidebarItem.items?.map((item: Chapter) => (
                <ChapterItem
                  key={item.title}
                  item={item}
                  parentPath={`/${sidebarItem.subject}`}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </section>
  );
}
