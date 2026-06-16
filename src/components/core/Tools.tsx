"use client";

import Image from "next/image";
import React, { useRef } from "react";

interface Tools {
  index: number;
  name: string;
  image: string;
}

const toolSet: Tools[] = [
  { index: 104, name: "Guide Book", image: "/guide_book.png" },
  { index: 103, name: "Measuring Tape", image: "/measuring_tape.png" },
  { index: 106, name: "Threads", image: "/threads.png" },
  { index: 107, name: "Pins and Needles", image: "/pins_needles.png" },
  { index: 109, name: "Fabric Chalk", image: "/fabric_chalk.png" },
];

const Tools = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="tools" ref={sectionRef} className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Tools & Accessories Provided
          </h2>
          <p className="text-muted-foreground font-sans text-lg max-w-2xl mx-auto">
            Everything you need to master your craft. We provide our students with the essential, high-quality equipment to start their tailoring journey.
          </p>
        </div>
        
        {/* Responsive Grid for 5 items */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
          {toolSet.map((tool) => (
            <div
              key={tool.index}
              className="group flex flex-col items-center justify-center bg-card border border-border hover:border-primary/50 transition-all rounded-[2rem] p-8 shadow-sm hover:shadow-md"
            >
              <div className="relative w-28 h-28 mb-6 transition-transform duration-500 group-hover:scale-110">
                <Image
                  src={tool.image || "/placeholder.svg"}
                  alt={tool.name}
                  fill
                  style={{ objectFit: "contain" }}
                  quality={90}
                />
              </div>
              <h3 className="font-sans font-bold text-lg text-foreground text-center">
                {tool.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
