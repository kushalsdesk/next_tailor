"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import EnrollmentForm, {
  EnrollmentFormValues,
} from "@/components/modals/EnrollmentForm.modal";
import SyllabusModal from "@/components/modals/Syllabus.modal";
import { courses, diplomaCourse, type Course } from "@/lib/CourseData";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showSyllabus, setShowSyllabus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.id = "courses";
    }

    const handleHashChange = () => {
      if (window.location.hash === "#courses" && sectionRef.current) {
        const headerHeight = 80;
        const yOffset = -headerHeight;
        const y =
          sectionRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    if (window.location.hash === "#courses") {
      setTimeout(handleHashChange, 100);
    }

    document.querySelectorAll('a[href="#courses"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();

        if (sectionRef.current) {
          const headerHeight = 80;
          const yOffset = -headerHeight;
          const y =
            sectionRef.current.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });

          window.history.pushState(null, "", "#courses");
        }
      });
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleEnroll = (courseName: string) => {
    setSelectedCourse(courseName === selectedCourse ? null : courseName);
  };

  const handleShowSyllabus = (courseName: string) => {
    setShowSyllabus(courseName === showSyllabus ? null : courseName);
  };

  const handleSubmit = async (data: EnrollmentFormValues) => {
    setIsSubmitting(true);
    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit enrollment");
      clearInterval(interval);
      setProgress(100);
    } catch (error) {
      setProgress(0);
      toast.error("Failed to submit enrollment. Please try again.");
      console.error("Enrollment Submission Error:", error);
    } finally {
      setIsSubmitting(false);
      setSelectedCourse(null);
      setProgress(0);
      toast.success("Enrollment Successful!", {
        description: `You have successfully enrolled for ${selectedCourse}, Admin Will Connect Shortly, Stay Tuned`,
      });
    }
  };

  const handleCancel = () => {
    setSelectedCourse(null);
    setShowSyllabus(null);
  };

  {
    /*Every Course*/
  }
  const renderCourseCard = (course: Course, index: number) => (
    <motion.div
      key={index}
      className="flex flex-grow flex-col text-left md:max-w-[48%] p-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/20 rounded-md text-white relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <CardHeader className="pb-4">
        <CardTitle>{course.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col  space-y-2 text-left">
        <p>
          <strong className="text-[#F0C38E]">Duration:</strong>{" "}
          {course.duration}
        </p>
        <DropdownMenu>
          <div className="flex flex-row  items-center justify-between w-full ">
            <strong className="text-[#F0C38E] text-left  w-full md:hidden">
              Fee Details:
            </strong>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className=" w-fit md:w-full text-[#221F39] bg-white/10  border-none justify-center items-center  md:justify-between"
              >
                <strong className="text-[#F0C38E] hidden md:block">
                  Fee Details
                </strong>
                <ChevronDown className="h-8 w-8  animate-bounce  text-[#F0C38E]" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent
            align="end"
            className="w-[200px] bg-[#110016]/80 backdrop-blur-md text-[#F0C38E] font-semibold border border-[#F0C38E]/20"
          >
            <DropdownMenuItem>
              <span>Admission: {course.fee.admission}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Monthly: {course.fee.monthly}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Exam: {course.fee.exam}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            className="flex-1 text-md font-semibold bg-[#9370DB]/10 text-white border-[#9370DB] hover:text-[#9370DB] shadow-lg shadow-[#9370DB]/30 transition-all duration-300"
            onClick={() => handleEnroll(course.name)}
          >
            Enroll Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-md font-semibold bg-[#F0C38E]/10 text-white border-[#F0C38E] hover:text-[#F0C38E] shadow-lg shadow-[#F0C38E]/30 transition-all duration-300"
            onClick={() => handleShowSyllabus(course.name)}
          >
            Syllabus
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
  {
    /*Diploma Course*/
  }
  const renderDiplomaCourseCard = () => (
    <motion.div
      className="flex flex-grow flex-col text-left md:max-w-[48%] p-4 backdrop-blur-sm bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/20 rounded-md text-white relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1, duration: 0.6 }}
    >
      <CardHeader className="pb-4">
        <CardTitle>{diplomaCourse.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2 text-left">
        <p>
          <strong className="text-[#F0C38E]">Duration:</strong>{" "}
          {diplomaCourse.duration}
        </p>
        <DropdownMenu>
          <div className="flex flex-row  items-center justify-between w-full ">
            <strong className="text-[#F0C38E] text-left  w-full md:hidden">
              Fee Details:
            </strong>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className=" w-fit md:w-full text-[#221F39] bg-white/10  border-none justify-center items-center  md:justify-between"
              >
                <strong className="text-[#F0C38E] hidden md:block">
                  Fee Details
                </strong>
                <ChevronDown className="h-8 w-8  animate-bounce  text-[#F0C38E]" />
              </Button>
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent
            align="end"
            className="w-[200px] bg-[#221F39] text-[#F0C38E] font-semibold"
          >
            <DropdownMenuItem>
              <span>Admission: {diplomaCourse.fee.admission}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Monthly: {diplomaCourse.fee.monthly}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Exam: {diplomaCourse.fee.exam}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            className="flex-1 text-md font-semibold bg-[#9370DB]/10 text-white border-[#9370DB] hover:text-[#9370DB] shadow-lg shadow-[#9370DB]/30 transition-all duration-300"
            onClick={() => handleEnroll(diplomaCourse.name)}
          >
            Enroll Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-md font-semibold bg-[#F0C38E]/10 text-white border-[#F0C38E] hover:text-[#F0C38E] shadow-lg shadow-[#F0C38E]/30 transition-all duration-300"
            onClick={() => handleShowSyllabus(diplomaCourse.name)}
          >
            Syllabus
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="py-20 backdrop-blur-sm relative">
      {isSubmitting && (
        <Progress value={100} className="w-full h-1 fixed top-0 left-0 z-50" />
      )}

      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-[#F0C38E] drop-shadow-[0_0_10px_#F0C38E] sm:drop-shadow-[0_0_15px_#F0C38E]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Offered Courses
        </motion.h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {courses.map((course, index) => renderCourseCard(course, index))}
        </div>

        <motion.h3
          className="text-3xl font-bold my-12 text-center text-[#F0C38E] drop-shadow-[0_0_10px_#F0C38E] sm:drop-shadow-[0_0_15px_#F0C38E]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Diploma Course
        </motion.h3>
        <div className="flex justify-center">{renderDiplomaCourseCard()}</div>
      </div>

      {/* Enrollment Form Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => !isSubmitting && handleCancel()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1a1a1c] p-6 rounded-lg shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <EnrollmentForm
                course={
                  courses.find((c) => c.name === selectedCourse) ||
                  diplomaCourse
                }
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isOpen={!!selectedCourse}
                isSubmitting={isSubmitting}
                progress={progress}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Syllabus Modal */}
      <AnimatePresence>
        {showSyllabus && (
          <SyllabusModal
            course={
              courses.find((c) => c.name === showSyllabus) || diplomaCourse
            }
            onClose={() => setShowSyllabus(null)}
          />
        )}
      </AnimatePresence>

      {
        //<div className="fixed bottom-10 inset-x-4 sm:inset-auto sm:right-4 sm:bottom-4 z-[9999]">
        //  <Toaster />
        //</div>
      }
    </section>
  );
};
export default Courses;
