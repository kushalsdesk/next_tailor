"use client";

import { useState, useEffect, useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { motion, AnimatePresence } from "framer-motion";
import { courses, diplomaCourse } from "@/lib/CourseData";
import { ChevronDown, CheckCircle2, BookOpen } from "lucide-react";

const allCourses = [...courses, diplomaCourse];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(allCourses[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.id = "courses";
    }

    const handleHashChange = () => {
      if (window.location.hash === "#courses" && sectionRef.current) {
        const headerHeight = 80;
        const yOffset = -headerHeight;
        const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    let timeoutId: NodeJS.Timeout;
    if (window.location.hash === "#courses") {
      timeoutId = setTimeout(handleHashChange, 100);
    }
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Course Syllabus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
            Explore our carefully curated courses. Select a course below to view its complete syllabus.
          </p>
        </motion.div>

        {/* Sticky Dropdown Selection */}
        <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md py-4 mb-12 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="max-w-2xl mx-auto relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full bg-card text-foreground border-2 border-border hover:border-primary/50 rounded-xl p-5 font-serif text-2xl font-bold flex items-center justify-between transition-all shadow-md ${isDropdownOpen ? "border-primary" : ""}`}
            >
              <span className="truncate">{selectedCourse.name}</span>
              <ChevronDown className={`w-8 h-8 text-muted-foreground transition-transform duration-300 shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`} />
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
                  <div className="p-2">
                    {allCourses.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          setSelectedCourse(c);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left p-4 hover:bg-secondary rounded-lg transition-colors border-b border-border/50 last:border-0 flex items-center justify-between group ${
                          selectedCourse.name === c.name ? "bg-primary/5 text-primary" : "text-foreground"
                        }`}
                      >
                        <span className="font-semibold text-lg font-serif group-hover:text-primary transition-colors">{c.name}</span>
                        {selectedCourse.name === c.name && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Syllabus Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCourse.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
              <BookOpen className="w-8 h-8 text-primary" />
              <h3 className="text-3xl font-serif font-bold text-foreground">
                {selectedCourse.name}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {/* Normal Course Syllabus */}
              {"syllabus" in selectedCourse && Object.entries(selectedCourse.syllabus as Record<string, string[]>).map(([category, items]) => (
                <div key={category}>
                  <h5 className="font-semibold text-primary mb-4 font-sans border-b border-border pb-2 text-xl">{category}</h5>
                  <ul className="space-y-4">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-lg font-medium text-muted-foreground font-sans">
                        <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Diploma Course Semesters */}
              {"semesters" in selectedCourse && Object.entries(selectedCourse.semesters as Record<string, Record<string, string[]>>).map(([semester, subjects]) => (
                <div key={semester} className="md:col-span-2 mb-4">
                  <h5 className="font-bold text-primary mb-6 font-sans text-2xl border-b border-border pb-3">{semester}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {Object.entries(subjects).map(([category, items]) => (
                      <div key={category}>
                        <h6 className="font-semibold text-foreground mb-4 font-sans text-xl">{category}</h6>
                        <ul className="space-y-4">
                          {items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-lg font-medium text-muted-foreground font-sans">
                              <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Courses;
