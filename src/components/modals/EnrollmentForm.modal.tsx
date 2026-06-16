"use client";
import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Course } from "@/lib/CourseData";

const enrollmentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  course: z.string().min(5, "Course name is readOnly"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  pincode: z.string().regex(/^\d{6}$/, "Invalid Pincode (6 digits required)"),
  phone: z.string().regex(/^\d{10}$/, "Invalid Phone Number (10 digits required)"),
  email: z.string().email("Invalid Email Address"),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  course: Course | typeof import("@/lib/CourseData").diplomaCourse;
  onSubmit: (data: EnrollmentFormValues) => void;
  onCancel: () => void;
  isOpen?: boolean; // Kept for compatibility
  isSubmitting: boolean;
  progress: number;
}

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({
  course,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      course: course.name,
    }
  });

  // Re-sync course value if the prop changes
  useEffect(() => {
    setValue("course", course.name);
  }, [course.name, setValue]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground font-semibold">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="bg-card border-border text-foreground focus:border-primary focus:ring-primary"
            />
            {errors.firstName && <p className="text-destructive text-sm font-medium">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground font-semibold">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="bg-card border-border text-foreground focus:border-primary focus:ring-primary"
            />
            {errors.lastName && <p className="text-destructive text-sm font-medium">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-foreground font-semibold">Address</Label>
          <Textarea
            id="address"
            {...register("address")}
            className="bg-card border-border text-foreground focus:border-primary focus:ring-primary min-h-[100px]"
          />
          {errors.address && <p className="text-destructive text-sm font-medium">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="pincode" className="text-foreground font-semibold">Pincode</Label>
            <Input
              id="pincode"
              {...register("pincode")}
              className="bg-card border-border text-foreground focus:border-primary focus:ring-primary"
            />
            {errors.pincode && <p className="text-destructive text-sm font-medium">{errors.pincode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-semibold">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              className="bg-card border-border text-foreground focus:border-primary focus:ring-primary"
            />
            {errors.phone && <p className="text-destructive text-sm font-medium">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="bg-card border-border text-foreground focus:border-primary focus:ring-primary"
          />
          {errors.email && <p className="text-destructive text-sm font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="course" className="text-foreground font-semibold">Selected Course</Label>
          <Input
            id="course"
            value={course.name}
            {...register("course")}
            readOnly
            className="bg-secondary border-border text-muted-foreground cursor-not-allowed"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all font-sans py-6 text-lg rounded-xl mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Application..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};

export default EnrollmentForm;
