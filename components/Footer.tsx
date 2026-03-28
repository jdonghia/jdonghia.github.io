import { cn } from "@/lib/utils";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function Footer({
  className,
}: React.ComponentPropsWithoutRef<"footer">) {
  return (
    <footer
      className={cn(
        "relative flex flex-col items-center space-y-4 py-20",
        className,
      )}
    >
      <ul className="text-eerie-black dark:text-seasalt flex items-center gap-4 transition-all">
        <li>
          <Link href="https://github.com/jdonghia" target="_blank">
            <GitHubLogoIcon className="text-jet dark:text-seasalt dark:hover:text-light-sea-green hover:text-light-sea-green size-8 cursor-pointer transition-all" />
          </Link>
        </li>
        <li>
          <Link
            href="https://www.linkedin.com/in/joao-donghia/"
            target="_blank"
          >
            <LinkedInLogoIcon className="text-jet dark:text-seasalt dark:hover:text-light-sea-green hover:text-light-sea-green size-8 cursor-pointer" />
          </Link>
        </li>
      </ul>
    </footer>
  );
}
