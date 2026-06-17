"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courses, diplomaCourse } from "@/lib/CourseData";
import { Clock, IndianRupee, ScrollText, ChevronDown, CheckCircle2 } from "lucide-react";
import EnrollmentForm from "@/components/modals/EnrollmentForm.modal";

const allCourses = [...courses, diplomaCourse];

export default function Application() {
  const [selectedCourse, setSelectedCourse] = useState(allCourses[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section id="application" className="py-24 bg-secondary/10 relative border-y border-border">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Admission Application
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
            Select the course you wish to enroll in, review the details, and submit your application online.
          </p>
        </motion.div>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-xl flex flex-col gap-8 relative overflow-hidden">
          {/* Decorator blob */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Custom Dropdown Selection */}
          <div className="relative z-40">
            <label className="block text-sm font-semibold text-muted-foreground mb-3 tracking-wide uppercase">Select a Course to Apply For</label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full bg-background text-foreground border-2 border-border hover:border-primary/50 rounded-xl p-4 font-serif text-xl font-bold flex items-center justify-between transition-all shadow-sm ${isDropdownOpen ? "border-primary" : ""}`}
              >
                <span className="truncate">{selectedCourse.name}</span>
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
                          <span className="font-semibold text-base font-serif group-hover:text-primary transition-colors">{c.name}</span>
                          {selectedCourse.name === c.name && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCourse.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-secondary/30 rounded-xl p-6 border border-border flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10"
            >
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-base font-sans font-semibold text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-foreground">{selectedCourse.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-accent" />
                  <span>Admission: <span className="text-foreground">{selectedCourse.fee.admission}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-accent" />
                  <span>Monthly: <span className="text-foreground">{selectedCourse.fee.monthly}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-accent" />
                  <span>Exam: <span className="text-foreground">{selectedCourse.fee.exam}</span></span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Form Component */}
          <div className="border-t border-border pt-8 relative z-10">
            <EnrollmentForm course={selectedCourse} />
          </div>

        </div>
      </div>
    </section>
  );
}
