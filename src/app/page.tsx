import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen">
      <div className="relative z-10">
        <Hero />
        <About />
        <Process />
        {/* Projects is a server component that performs async fetches */}
        <Projects />
        <Skills />
        <Contact />
      </div>
    </main>
  );
}
