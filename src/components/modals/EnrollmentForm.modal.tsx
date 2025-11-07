"use client";
import type React from "react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Course } from "@/lib/CourseData";
import { Progress } from "@/components/ui/progress";

const enrollmentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  course: z.string().min(5, "Course name is readOnly"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode (6 digits required)"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Invalid Phone Number (10 digits required)"),
  email: z.string().email("Invalid Email Address"),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  course: Course | typeof import("@/lib/CourseData").diplomaCourse;
  onSubmit: (data: EnrollmentFormValues) => void;
  onCancel: () => void;
  isOpen: boolean;
  isSubmitting: boolean;
  progress: number;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  course,
  onSubmit,
  onCancel,
  isOpen,
  isSubmitting,
  progress,
}) => {
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && headerRef.current) {
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
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
          onClick={onCancel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 backdrop-blur-sm border border-white/30 p-6 rounded-lg shadow-lg max-w-lg w-[90%] mt-16"
          >
            <FormContent
              course={course}
              onSubmit={onSubmit}
              onCancel={onCancel}
              headerRef={headerRef}
              isSubmitting={isSubmitting}
              progress={progress}
            />
          </div>
        </div>
      )}
    </>
  );
};

const FormContent: React.FC<
  Omit<EnrollmentFormProps, "isOpen"> & {
    headerRef: React.RefObject<HTMLHeadingElement>;
  }
> = ({ course, onSubmit, onCancel, headerRef, isSubmitting, progress }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
  });

  return (
    <>
      <div
        ref={headerRef}
        className="flex justify-between items-center mb-4 sticky top-0  py-4 z-10"
      >
        <h3
          tabIndex={-1}
          className="text-xl font-semibold text-[#F0C38E] outline-none"
        >
          Enrollment Form
        </h3>
        <Button
          variant="default"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 bg-[#F0C38E] hover:bg-black hover:text-white text-[#9370DB]/90"
          disabled={isSubmitting}
        >
          <X size={18} />
        </Button>
      </div>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[#F0C38E]">
              First Name
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="bg-black/50 border-[#9370DB]/50 text-white focus:border-[#F0C38E]"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[#F0C38E]">
              Last Name
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="bg-black/50 border-[#9370DB]/50 text-white focus:border-[#F0C38E]"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-[#F0C38E]">
            Address
          </Label>
          <Textarea
            id="address"
            {...register("address")}
            className="bg-black/50 border-[#9370DB]/50 text-white focus:border-[#F0C38E]"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-[#F0C38E]">
              Pincode
            </Label>
            <Input
              id="pincode"
              {...register("pincode")}
              className="bg-black/50 border-[#9370DB]/50 text-white focus:border-[#F0C38E]"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#F0C38E]">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="bg-black/50 border-[#9370DB]/50 text-white focus:border-[#F0C38E]"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#F0C38E]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-black/50 border-[#9370DB]/50 text-white focus:border-[#F0C38E]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course" className="text-[#F0C38E]">
            Selected Course
          </Label>
          <Input
            id="course"
            value={course.name}
            {...register("course")}
            readOnly
            className="bg-black/70 border-[#9370DB]/50 text-white cursor-not-allowed"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#9370DB] hover:bg-[#9370DB]/80 text-white font-semibold shadow-lg shadow-[#9370DB]/30"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Enrollment"}
        </Button>

        {isSubmitting && (
          <div className="w-full">
            <Progress
              value={progress}
              className={`h-2 transition-all duration-300 ${
                progress < 50
                  ? "bg-[#F0C38E] shadow-[#F0C38E]"
                  : "bg-[#9370DB] shadow-[#9370DB]"
              } shadow-lg`}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default EnrollmentForm;
