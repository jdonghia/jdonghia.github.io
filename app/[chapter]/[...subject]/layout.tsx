import { Copyright } from "@/components/Copyright";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { getChapters } from "@/lib/writings";

export default async function Layout({ children }: React.PropsWithChildren) {
  const chapters = await getChapters();

  return (
    <>
      <div className="flex justify-around pb-4">
        <aside className="sticky pe-10 top-[calc(63px+56px)] h-full flex-1 text-sm max-lg:hidden">
          <Sidebar chapters={chapters} />
        </aside>

        <section className="overflow-hidden m-auto max-w-2xl space-y-5">
          {children}
          <Footer className="pt-96 mb-0 pb-6" />
          <Copyright />
        </section>

        <aside className="sticky ps-10 top-[calc(63px+56px)] h-full flex-1 text-sm max-lg:hidden">
          <TableOfContents />
        </aside>
      </div>
    </>
  );
}
