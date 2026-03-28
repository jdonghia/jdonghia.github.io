"use client";

import { cn } from "@/lib/utils";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link, { LinkProps } from "next/link";

export function ArrowLink({ children, className, href, ...props }: LinkProps & React.ComponentPropsWithoutRef<"a">) {
  return (
    <div className="group w-fit">
      <Link
        href={href}
        className={cn(
          "hover:text-light-sea-green hover:dark:text-light-sea-green text-eerie-black dark:text-seasalt transition-all",
          className,
        )}
        {...props}
      >
        {children}
        <ArrowTopRightIcon className="-translate-y-1 ms-1 inline-block size-3 transition-transform duration-150 ease-out group-hover:translate-x-1 group-hover:-translate-y-2" />
      </Link>
    </div>
  );
}
