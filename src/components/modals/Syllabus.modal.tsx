"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/CourseData";

interface SyllabusModalProps {
  course: Course | typeof import("@/lib/CourseData").diplomaCourse;
  onClose: () => void;
}

const SyllabusModal: React.FC<SyllabusModalProps> = ({ course, onClose }) => {
  const isDiploma = "semesters" in course;
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Small timeout to ensure the modal is fully rendered before focusing
    const timer = setTimeout(() => {
      if (headerRef.current) {
        headerRef.current.focus();
        // Adjust scroll position to account for navbar height
        headerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1a1a1c] p-6 rounded-lg shadow-2xl w-full max-w-md sm:max-w-4xl max-h-[80vh] overflow-y-auto "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#1a1a1c] py-4 z-10">
          <h3
            ref={headerRef}
            tabIndex={-1}
            className="text-2xl font-semibold text-[#F0C38E] outline-none"
          >
            {course.name} - Syllabus
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-[#F0C38E] hover:text-white hover:bg-[#9370DB]/20"
          >
            <X size={18} />
          </Button>
        </div>

        {isDiploma ? (
          Object.entries(course.semesters).map(([semester, subjects]) => (
            <div key={semester} className="mb-6">
              <h4 className="text-xl font-semibold text-[#F0C38E] mb-2">
                {semester}
              </h4>
              {Object.entries(subjects).map(([subject, topics]) => (
                <div key={subject} className="mb-4">
                  <h5 className="text-lg font-medium text-gray-400 mb-2">
                    {subject}
                  </h5>
                  <ul className="list-disc list-inside">
                    {topics.map((topic, topicIndex) => (
                      <li
                        key={topicIndex}
                        className={`py-1 text-white px-2 ${topicIndex % 2 === 0 ? "bg-[#9370DB]/10" : "bg-[#F0C38E]/10"}`}
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div>
            {Object.entries(course.syllabus || {}).map(([category, topics]) => (
              <div key={category} className="mb-4">
                <h4 className="text-lg font-medium text-[#F0C38E] mb-2">
                  {category}
                </h4>
                <ul className="list-disc list-inside">
                  {topics.map((topic, topicIndex) => (
                    <li
                      key={topicIndex}
                      className={`text-gray-400 py-1 px-2 ${topicIndex % 2 === 0 ? "bg-[#9370DB]/10" : "bg-[#F0C38E]/10"}`}
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SyllabusModal;
