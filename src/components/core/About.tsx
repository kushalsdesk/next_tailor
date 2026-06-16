"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, CheckCircle, GraduationCap, Users, Clock, Target, Scissors, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  { quote: "The best tailoring institute! I started my own boutique within 6 months.", author: "Priya S." },
  { quote: "Amazing instructors and completely hands-on learning.", author: "Anjali M." },
  { quote: "Got my Govt certificate, totally worth it. The MSME guidance was a lifesaver.", author: "Neha K." },
  { quote: "Flexible timings helped me learn while working a full-time job.", author: "Sneha R." },
  { quote: "They taught me how to turn old clothes into designer pieces!", author: "Kiran T." },
];

const features = [
  {
    title: "Expert Instructors",
    description: "Learn from Certified Industry Professionals with years of real-world experience.",
    icon: <Users className="w-6 h-6 text-accent" />,
    colSpan: "md:col-span-1",
  },
  {
    title: "Hands-on Training",
    description: "Get practical experience with state-of-the-art equipment.",
    icon: <Scissors className="w-6 h-6 text-accent" />,
    colSpan: "md:col-span-1",
  },
  {
    title: "Industry Connections",
    description: "Network with fashion houses and potential employers.",
    icon: <Briefcase className="w-6 h-6 text-accent" />,
    colSpan: "md:col-span-1",
  },
  {
    title: "Flexible Schedule",
    description: "Choose from day and evening classes with online and offline modes to fit your lifestyle.",
    icon: <Clock className="w-6 h-6 text-accent" />,
    colSpan: "md:col-span-2",
  },
  {
    title: "Career Support",
    description: "Receive guidance on job placements and entrepreneurship.",
    icon: <Target className="w-6 h-6 text-accent" />,
    colSpan: "md:col-span-1",
  },
  {
    title: "Making Old into New",
    description: "Dress Making is an enjoyable craft and a lucrative way to earn money. Make attractive handmade dresses & accessories with old clothes and make it a professional art.",
    icon: <GraduationCap className="w-6 h-6 text-accent" />,
    colSpan: "md:col-span-3",
  },
];

const galleryImages = ["/sample.jpeg", "/images/image1.jpeg", "/images/image2.jpeg"];

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = () => setCurrentImg((prev) => (prev + 1) % galleryImages.length);
  const prevImg = () => setCurrentImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <section id="about" ref={sectionRef} className="relative z-10 pt-24 bg-background flex flex-col">
      <div className="container mx-auto px-4 max-w-7xl flex-grow mb-24">
        
        {/* Header - Removed problematic framer-motion whileInView to fix disappearing bug */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Why ASHAA?
          </h2>
          <p className="text-muted-foreground font-sans text-lg">
            The Premier Destination for Professional Tailoring Education
          </p>
        </div>

        {/* First Card - Reimagined */}
        <div className="bg-card border border-border rounded-[2rem] p-8 lg:p-12 mb-16 shadow-sm overflow-hidden relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col z-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit mb-6 font-semibold text-sm border border-primary/20">
                <CheckCircle className="w-5 h-5" />
                Government Certified Institute
              </div>
              
              <h3 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6 leading-snug">
                Turn your <span className="text-primary italic">passion for fashion</span> into a successful profession.
              </h3>
              
              <p className="text-muted-foreground font-sans text-lg leading-relaxed mb-10">
                <strong className="text-foreground">ASHAA</strong> is a Government-Certified Independent Training Center dedicated to empowering individuals with hands-on experience in garment design and stitching. We offer diverse practical courses with pattern making at highly affordable fees.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href={"#career"}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-primary/20 w-full sm:w-auto"
                >
                  <Briefcase className="w-5 h-5" /> Career Options
                </Link>
                
                <a href="https://aicvt.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 sm:border-l-2 sm:border-border sm:pl-6 hover:opacity-80 transition-opacity">
                  <Image src="/aicvt.png" alt="AICVT logo" width={56} height={56} className="object-contain" />
                  <p className="text-sm font-semibold text-foreground max-w-[150px] leading-tight">
                    Affiliated with All India Council For Vocational Training
                  </p>
                </a>
              </div>
            </div>

            {/* Right Content - Inline Gallery & Certificate */}
            <div className="flex flex-col gap-6 z-10">
              {/* Changed bg-secondary to bg-background to avoid purple tint */}
              <div className="bg-background rounded-[1.5rem] p-6 border border-border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-foreground font-serif font-bold text-xl">
                    Campus & Certifications
                  </h4>
                  <div className="flex gap-2">
                    <button onClick={prevImg} className="p-2 bg-background border border-border rounded-full shadow-sm hover:text-primary transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                    <button onClick={nextImg} className="p-2 bg-background border border-border rounded-full shadow-sm hover:text-primary transition-colors"><ChevronRight className="w-5 h-5"/></button>
                  </div>
                </div>
                
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white border border-border shadow-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImg}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={galleryImages[currentImg]}
                        alt="Gallery"
                        fill
                        className="object-contain p-2"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex justify-center gap-3 mt-6">
                  {galleryImages.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImg(idx)}
                      className={`h-2 rounded-full transition-all ${currentImg === idx ? 'bg-primary w-8' : 'bg-border hover:bg-primary/50 w-2'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Six Feature Cards - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className={`bg-card border border-border rounded-3xl p-8 hover:border-primary/50 transition-colors shadow-sm flex flex-col justify-center ${item.colSpan}`}
            >
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h4 className="text-2xl font-serif font-bold text-foreground mb-3">{item.title}</h4>
              <p className="text-muted-foreground font-sans text-lg leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Testimonials - Thin Purple Strip at the very bottom */}
      <div className="w-full bg-primary py-3 overflow-hidden flex items-center shadow-inner mt-auto">
        <motion.div
          className="flex gap-8 whitespace-nowrap min-w-max px-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        >
          {/* Duplicated array for seamless infinite scrolling */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <span key={i} className="text-primary-foreground font-sans font-medium text-sm md:text-base flex items-center gap-8">
              <span>&quot;{t.quote}&quot; — <span className="font-bold">{t.author}</span></span>
              <span className="text-primary-foreground/40 font-light">|</span>
            </span>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default About;
