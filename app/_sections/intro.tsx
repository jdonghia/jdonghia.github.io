import { Footer } from "@/components/Footer";

export function Intro() {
  return (
    <section className="space-y-1">
      <h1 className="font-inter-tight text-eerie-black dark:text-seasalt text-5xl font-bold">João Donghia</h1>

      <h2 className="font-inter-tight text-eerie-black dark:text-seasalt mt-2 text-xl">Software Engineer</h2>

      <h3 className="my-5">
        Writing about development and 
        <br />
        sharing thoughts on software, tools, and learning.
      </h3>

      <Footer className="items-start py-3" />
    </section>
  );
}
