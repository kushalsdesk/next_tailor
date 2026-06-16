"use client";

import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import HeroSection from "@/components/core/HeroSection";
import About from "@/components/core/About";
import Courses from "@/components/core/Courses";
import Tools from "@/components/core/Tools";
import Career from "@/components/core/Career";

const Page = () => {
  const [position, setPosition] = useState<"top-center" | "bottom-right">(
    "top-center",
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPosition("top-center");
      } else {
        setPosition("bottom-right");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="flex-grow">
      <HeroSection />
      <About />
      <Courses />
      <Tools />
      <Career />
      <Toaster position={position} richColors />
    </main>
  );
};

export default Page;
