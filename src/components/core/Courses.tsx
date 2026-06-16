"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import EnrollmentForm from "@/components/modals/EnrollmentForm.modal";
import { courses, diplomaCourse } from "@/lib/CourseData";
import { ChevronRight, CheckCircle2, Clock, IndianRupee, BookOpen, ScrollText } from "lucide-react";

const allCourses = [...courses, diplomaCourse];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(allCourses[0]);
  const [activeTab, setActiveTab] = useState<"syllabus" | "enroll">("syllabus");

  const sectionRef = useRef<HTMLElement>(null);

  // Reset tab when course changes
  useEffect(() => {
    setActiveTab("syllabus");
  }, [selectedCourse]);

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
    if (window.location.hash === "#courses") {
      setTimeout(handleHashChange, 100);
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Offered Courses
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
            Explore our carefully curated courses designed to transform your passion into a professional career. Select a course to view its details.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:items-start">
          {/* Left Column: Course Selection */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3 lg:sticky lg:top-24">
            {allCourses.map((course, index) => (
              <button
                key={index}
                onClick={() => setSelectedCourse(course)}
                className={`w-full text-left px-6 py-5 rounded-xl transition-all duration-300 border flex items-center justify-between group ${
                  selectedCourse.name === course.name
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-card text-card-foreground border-border hover:border-primary/50 hover:bg-secondary"
                }`}
              >
                <span className="font-semibold font-serif text-xl leading-snug">{course.name}</span>
                <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${selectedCourse.name === course.name ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              </button>
            ))}
          </div>

          {/* Right Column: Course Details & Enrollment */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCourse.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm flex flex-col h-full min-h-[500px]"
              >
                <div className="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-4">
                      {selectedCourse.name}
                    </h3>
                    <div className="flex flex-wrap gap-6 text-base font-sans font-semibold text-muted-foreground">
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
                  </div>
                  
                  {/* Dynamic Button toggles between Enroll form and Syllabus */}
                  <Button 
                    onClick={() => setActiveTab(activeTab === "syllabus" ? "enroll" : "syllabus")}
                    className={`w-full md:w-auto px-8 py-6 text-lg font-semibold rounded-xl transition-all font-sans ${
                      activeTab === "syllabus" 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                    }`}
                  >
                    {activeTab === "syllabus" ? "Enroll Now" : "Back to Syllabus"}
                  </Button>
                </div>

                <div className="flex-1 relative">
                  <AnimatePresence mode="wait">
                    {activeTab === "syllabus" ? (
                      <motion.div
                        key="syllabus"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-6">
                          <BookOpen className="w-5 h-5 text-accent" />
                          <h4 className="text-xl font-serif font-semibold text-foreground">Course Syllabus</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                          {/* Normal Course Syllabus */}
                          {"syllabus" in selectedCourse && Object.entries(selectedCourse.syllabus as Record<string, string[]>).map(([category, items]) => (
                            <div key={category}>
                              <h5 className="font-semibold text-primary mb-3 font-sans border-b border-border pb-1 text-lg">{category}</h5>
                              <ul className="space-y-3">
                                {items.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-base font-medium text-muted-foreground font-sans">
                                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}

                          {/* Diploma Course Semesters */}
                          {"semesters" in selectedCourse && Object.entries(selectedCourse.semesters as Record<string, Record<string, string[]>>).map(([semester, subjects]) => (
                            <div key={semester} className="md:col-span-2 mb-2">
                              <h5 className="font-bold text-primary mb-4 font-sans text-xl border-b border-border pb-2">{semester}</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {Object.entries(subjects).map(([category, items]) => (
                                  <div key={category}>
                                    <h6 className="font-semibold text-foreground mb-3 font-sans text-lg">{category}</h6>
                                    <ul className="space-y-3">
                                      {items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-base font-medium text-muted-foreground font-sans">
                                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
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
                    ) : (
                      <motion.div
                        key="enroll"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-6">
                          <BookOpen className="w-5 h-5 text-accent" />
                          <h4 className="text-xl font-serif font-semibold text-foreground">Application Form</h4>
                        </div>
                        <div className="bg-card/50 rounded-xl">
                          <EnrollmentForm
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            course={selectedCourse as any}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
