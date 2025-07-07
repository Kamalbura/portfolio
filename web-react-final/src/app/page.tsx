'use client';

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Home() {
  // Initialize smooth scrolling
  useSmoothScroll();

  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
