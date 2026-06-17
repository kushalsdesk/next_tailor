"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ContactForm from "@/components/modals/ContactForm.modal";
import EnhancedParagraph from "@/components/modals/CareerPara.modal";
import { ChevronDown, CheckCircle2 } from "lucide-react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

        <div className="mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
             <h3 className="text-4xl font-serif font-bold text-foreground mb-4">Connect With Us</h3>
             <p className="text-muted-foreground font-sans text-lg">
               Select a career path below to get personalized guidance and start your journey.
             </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xl flex flex-col gap-8 relative overflow-hidden text-left">
            {/* Decorator blob */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Custom Dropdown Selection */}
            <div className="relative z-40">
              <label className="block text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">Select a Career Path</label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full bg-background text-foreground border-2 border-border hover:border-primary/50 rounded-xl p-4 font-serif text-xl font-bold flex items-center justify-between transition-all shadow-sm ${isDropdownOpen ? "border-primary" : ""}`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border bg-white">
                      <Image src={selectedCareer.icon} alt={selectedCareer.title} fill style={{ objectFit: "contain" }} />
                    </div>
                    <span className="truncate">{selectedCareer.title}</span>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-muted-foreground transition-transform duration-300 shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-2xl rounded-xl z-50 overflow-hidden"
                    >
                      <div className="max-h-[40vh] overflow-y-auto p-2">
                        {opportunities.map((opportunity) => (
                          <button
                            key={opportunity.title}
                            onClick={() => {
                              setSelectedCareer(opportunity);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left p-4 hover:bg-secondary rounded-lg transition-colors border-b border-border/50 last:border-0 flex items-center justify-between group ${
                              selectedCareer.title === opportunity.title ? "bg-primary/5 text-primary" : "text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border bg-white group-hover:border-primary transition-colors">
                                <Image src={opportunity.icon} alt={opportunity.title} fill style={{ objectFit: "contain" }} />
                              </div>
                              <span className="font-semibold text-base font-serif group-hover:text-primary transition-colors">{opportunity.title}</span>
                            </div>
                            {selectedCareer.title === opportunity.title && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Form Component */}
            <div className="border-t border-border pt-8 relative z-10">
              <ContactForm selectedCareer={selectedCareer.title} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Career;
