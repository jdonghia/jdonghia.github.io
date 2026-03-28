import { About } from "@/app/_sections/about";
import { ContactPage } from "@/app/_sections/contact-page";
import { Dashboard } from "@/app/_sections/dashboard";
import { Experience } from "@/app/_sections/experience/experience";
import { Intro } from "@/app/_sections/intro";
import { Projects } from "@/app/_sections/projects/projects";

export default function Home() {
  return (
    <div className="max-w-2xl xl:max-w-6xl mx-auto">
      <div className="xl:w-7/12 space-y-24 mx-auto">
        <Intro />
        <Dashboard />
        <About />
        <Experience />
        <Projects />
        <ContactPage />
      </div>
    </div>
  );
}
