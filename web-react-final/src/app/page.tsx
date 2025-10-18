import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Hero />
      <About />
      {/* Projects is a server component that performs async fetches */}
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
