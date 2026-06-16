"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Left Content Area */}
          <motion.div
            className="flex flex-col text-center lg:text-left z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-serif font-bold text-foreground leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Master the <br className="hidden lg:block" /> Art of{" "}
              <span className="italic text-primary relative inline-block">
                Tailoring
                {/* Subtle underline accent */}
                <span className="absolute bottom-2 left-0 w-full h-3 bg-accent/30 -z-10 skew-x-12" />
              </span>
            </motion.h1>
            
            <motion.p
              className="mt-6 mx-auto lg:mx-0 max-w-xl text-lg md:text-xl text-muted-foreground font-sans leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Learn Professional Tailoring and sewing skills with a 
              <strong className="text-foreground font-semibold"> Government Diploma Certificate</strong> from industrial 
              experts. Transform your passion and fulfill your hobbies with 
              various creative sewing techniques.
            </motion.p>
            
            {/* Mobile Contact Only */}
            <motion.p
              className="mb-8 font-semibold text-primary lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Contact Us @ +91 9147714547
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Link href="#courses" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto px-8 py-7 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 rounded-xl transition-all group">
                  Start Learning
                  <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#career" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-7 text-lg font-semibold bg-transparent border-2 border-border hover:border-primary/50 text-foreground hover:bg-secondary rounded-xl transition-all">
                  Explore Careers
                </Button>
              </Link>
            </motion.div>


          </motion.div>

          {/* Right Image Area */}
          <motion.div
            className="relative flex justify-center lg:justify-end items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Modern Editorial Image Framing */}
            <div className="relative w-full max-w-[550px] aspect-[4/5] md:aspect-square">
              {/* Decorative skewed backdrop layers */}
              <div className="absolute inset-0 bg-secondary rounded-[2rem] md:rounded-[3rem] rotate-3 scale-105 z-0 transition-transform duration-500 hover:rotate-6" />
              <div className="absolute inset-0 bg-primary/10 rounded-[2rem] md:rounded-[3rem] -rotate-3 scale-105 z-0 transition-transform duration-500 hover:-rotate-6" />
              
              {/* Main Image Container */}
              <div className="absolute inset-0 z-10 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl bg-white flex items-center justify-center p-8 lg:p-12">
                <Image
                  src="/hero.png"
                  alt="Tailoring Institute Illustration"
                  fill
                  priority
                  className="object-contain p-4 drop-shadow-xl"
                  quality={100}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
