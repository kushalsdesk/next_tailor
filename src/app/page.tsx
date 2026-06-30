"use client";

import React from "react";
import HeroSection from "@/components/core/HeroSection";
import About from "@/components/core/About";
import Courses from "@/components/core/Courses";
import Application from "@/components/core/Application";
import Tools from "@/components/core/Tools";
import Career from "@/components/core/Career";

const Page = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <About />
      <Courses />
      <Application />
      <Tools />
      <Career />
    </main>
  );
};

export default Page;
