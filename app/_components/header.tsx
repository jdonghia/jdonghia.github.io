"use client";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Expand } from "@theme-toggles/react";
import "@theme-toggles/react/css/Expand.css";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const DarkMode: any = Expand;

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) {
      return;
    }

    setIsDark(resolvedTheme === "dark");
  }, [mounted, resolvedTheme]);

  const handleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <header className="dark:border-gray border-cadet-gray z-50 sticky top-0 flex w-full items-center justify-between border-b px-8 py-4 bg-inherit">
      <span className="block absolute inset-0 bg-[url('/imgs/texture.png')] bg-cover bg-center bg-no-repeat opacity-[6%] dark:opacity-[4%]"></span>
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="text-light-sea-green block cursor-pointer text-md font-bold">donghia.dev</span>
          </Link>
          <div className="flex items-end justify-center gap-5">
            <Link
              href="https://github.com/jdonghia/folio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub"
              className="text-light-sea-green hover:text-jet dark:hover:text-seasalt inline-flex items-center self-end gap-1 transition-colors"
            >
              <GitHubLogoIcon className="size-4" />
              <p>Source</p>
            </Link>
            {mounted && isDark !== null ? (
              <DarkMode onToggle={handleTheme} className="text-light-sea-green text-3xl" toggled={isDark} />
            ) : (
              <span className="inline-block h-8 w-8" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
