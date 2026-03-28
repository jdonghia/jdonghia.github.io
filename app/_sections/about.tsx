import { SectionLabel } from "@/app/_components/section-label";
import { ArrowLink } from "@/components/ArrowLink";

export function About() {
  return (
    <section className="space-y-7">
      <SectionLabel>About me</SectionLabel>
      <article className="space-y-6">
        <p className="leading-7">
          I&apos;m a Software Engineer with 4+ years of professional experience. I build clean, functional, and efficient interfaces, always
          focusing on clarity, consistency, and performance.
        </p>
        <p className="leading-7">
          I currently work at Claro S.A, where I lead the development of Claro Música TV. My work is focused on keeping it stable, scalable,
          and easy to maintain.
        </p>
        <p className="leading-7">
          In the past, I’ve worked in consulting firms and finance companies adapt tech to different business needs.
        </p>
        <p className="leading-7">
          Structure, minimalism, and well-defined systems are central to how I think and work. On the side, I build side projects to
          experiment and keep learning.
        </p>
        <p className="leading-7">I also play piano, it helps me slow down and stay focused.</p>
        <ArrowLink target="_blank" href="resume.pdf">
          Check out my full resume
        </ArrowLink>
      </article>
    </section>
  );
}
