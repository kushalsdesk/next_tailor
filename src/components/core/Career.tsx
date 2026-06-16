"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ContactForm from "@/components/modals/ContactForm.modal";
import EnhancedParagraph from "@/components/modals/CareerPara.modal";
import { ChevronRight } from "lucide-react";

const opportunities = [
  { title: "Open your own boutique", icon: "/own_boutique.png" },
  { title: "Become a fashion designer", icon: "/fashion_designer.png" },
  { title: "Work with leading brands", icon: "/leading_brands.png" },
  { title: "Offer alteration services", icon: "/alteration_service.png" },
  { title: "Teach fashion and design", icon: "/teach_fashion.png" },
  { title: "Start an online clothing store", icon: "/online_store.png" },
];

const Career = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCareer, setSelectedCareer] = useState(opportunities[0]);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.id = "career";
    }

    const handleHashChange = () => {
      if (window.location.hash === "#career" && sectionRef.current) {
        const headerHeight = 80;
        const yOffset = -headerHeight;
        const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash === "#career") {
      setTimeout(handleHashChange, 100);
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative border-y border-border">
      <div className="container mx-auto px-4 text-center max-w-7xl">
        <motion.h2
          className="text-4xl md:text-5xl font-serif font-bold mb-12 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Launch Your Fashion Career
        </motion.h2>

        {/* Business Facilities (Hardcoded Cards for SEO) */}
        <EnhancedParagraph />

        {/* Career Opportunities Master-Detail Split Layout */}
        <div className="text-left mt-24 mb-10">
           <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Connect With Us</h3>
           <p className="text-muted-foreground font-sans text-lg">Select a career path below to get personalized guidance and start your journey.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start text-left">
          {/* Left Column: Opportunities List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:sticky lg:top-24">
            {opportunities.map((opportunity, index) => (
              <button
                key={index}
                onClick={() => setSelectedCareer(opportunity)}
                className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-300 border flex items-center justify-between group ${
                  selectedCareer.title === opportunity.title
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-4">
                   <div className="relative w-12 h-12 bg-white rounded-full overflow-hidden p-2 shrink-0 border border-border">
                     <Image src={opportunity.icon} alt={opportunity.title} fill style={{ objectFit: "contain" }} />
                   </div>
                   <span className="font-semibold font-serif text-xl leading-snug">{opportunity.title}</span>
                </div>
                <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${selectedCareer.title === opportunity.title ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              </button>
            ))}
          </div>

          {/* Right Column: Contact Form pre-filled */}
          <div className="w-full lg:w-2/3">
             <AnimatePresence mode="wait">
               <motion.div
                 key={selectedCareer.title}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="bg-card border border-border rounded-2xl p-8 shadow-sm flex flex-col h-full"
               >
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 border-b border-border pb-6">
                    <div className="relative w-20 h-20 bg-white rounded-2xl overflow-hidden p-3 shadow-sm border border-border shrink-0">
                       <Image src={selectedCareer.icon} alt={selectedCareer.title} fill style={{ objectFit: "contain" }} />
                    </div>
                    <div>
                       <h3 className="text-3xl font-serif font-bold text-foreground mb-2">
                         {selectedCareer.title}
                       </h3>
                       <p className="text-muted-foreground font-sans text-base">Fill out the form below to connect with our experts regarding this path.</p>
                    </div>
                 </div>

                 {/* Contact Form automatically pre-filled via props */}
                 <ContactForm selectedCareer={selectedCareer.title} />
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Career;
