"use client";
import type React from "react";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Phone, MapPin, Info, CheckCircle2, Clock, XCircle } from "lucide-react";
import type { Course } from "@/lib/CourseData";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

const enrollmentSchema = z.object({
  phone: z.string().min(10, "10-digit phone required"),
  zipcode: z.string().min(5, "Valid zip required"),
  course: z.string().min(1, "Course name is required"),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

interface EnrollmentFormProps {
  course: Course | typeof import("@/lib/CourseData").diplomaCourse;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ course }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Zustand Global State
  const { isAuthenticated, user, signInWithGoogle } = useAuthStore();

  const { data, mutate, isLoading } = useSWR(
    isAuthenticated && user?.uid ? `/api/admissions?userId=${user.uid}` : null,
    fetcher
  );

  const form = useForm<z.infer<typeof enrollmentSchema>>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      phone: "",
      zipcode: "",
      course: course.name,
    }
  });

  useEffect(() => {
    form.setValue("course", course.name);
  }, [course.name, form]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Failed to sign in with Google.");
    }
  };

  const handleApplyNow = async (values: EnrollmentFormValues) => {
    if (!user) return;
    setIsApplying(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          email: user.email,
          course: values.course,
          phone: values.phone,
          pincode: values.zipcode,
        }),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to submit application");
      
      toast.success(`Application for ${course.name} submitted successfully!`);
      mutate(); // Refresh the user's applications
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit application.");
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admissions/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete application");
      
      toast.success("Previous application cleared. You can now apply again!");
      mutate(); // Refresh the user's applications
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete application.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- UI STATE 1: NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-card/50 rounded-2xl h-full w-full">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Info className="w-10 h-10 text-primary" />
        </div>
        <h4 className="text-2xl font-serif font-bold text-foreground mb-3">Sign in to Apply</h4>
        <p className="text-muted-foreground mb-8 max-w-sm font-sans text-base">
          Sign in with your Google account to submit an application for <strong className="text-foreground">{course.name}</strong>.
        </p>
        <Button 
          onClick={handleGoogleSignIn} 
          className="bg-white hover:bg-gray-50 text-black border border-gray-200 shadow-sm rounded-xl py-6 px-8 text-lg font-medium flex items-center gap-3 transition-all hover:shadow-md"
        >
          <GoogleIcon />
          Continue with Google
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if user already applied for any admission
  const existingApp = data?.applications?.[0];

  // --- UI STATE 2: ALREADY APPLIED ---
  if (existingApp) {
    if (existingApp.status === "rejected") {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-card/50 rounded-2xl border border-border">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <h4 className="text-2xl font-serif font-bold text-foreground mb-2">Application Rejected</h4>
          <p className="text-muted-foreground mb-6 font-sans text-base max-w-md">
            Hey, sorry, your previous application for <strong className="text-foreground">{existingApp.course}</strong> got rejected. You can clear this status and try submitting a newer application.
          </p>
          <Button 
            onClick={() => handleDeleteApplication(existingApp._id as string)}
            disabled={isDeleting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 px-6 rounded-xl shadow-md transition-all font-sans"
          >
            {isDeleting ? "Clearing..." : "Try Newer Application"}
          </Button>
        </div>
      );
    }

    const statusIcons = {
      submitted: <Clock className="w-12 h-12 text-blue-500 mb-4" />,
      reviewed: <Info className="w-12 h-12 text-yellow-500 mb-4" />,
      accepted: <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />,
    };
    
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-card/50 rounded-2xl border border-border">
        {statusIcons[existingApp.status as keyof typeof statusIcons] || <Clock className="w-12 h-12 text-primary mb-4" />}
        <h4 className="text-2xl font-serif font-bold text-foreground mb-2">Application Submitted</h4>
        <p className="text-muted-foreground mb-4 font-sans text-base">
          You already have an active application for <strong className="text-foreground">{existingApp.course}</strong>.
        </p>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Status:</span>
          <Badge variant="outline" className={`capitalize text-sm ${
            existingApp.status === "accepted" ? "text-green-500 border-green-500 bg-green-500/10" :
            existingApp.status === "reviewed" ? "text-yellow-500 border-yellow-500 bg-yellow-500/10" : 
            "text-blue-500 border-blue-500 bg-blue-500/10"
          }`}>
            {existingApp.status}
          </Badge>
        </div>
      </div>
    );
  }

  // --- UI STATE 3: AUTHENTICATED FORM ---
  return (
    <div className="flex flex-col h-full w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleApplyNow)} className="flex flex-col gap-6 flex-1">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Application Details</h4>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-semibold h-4 flex items-center">Selected Course</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly value={course.name} className="h-9 text-sm bg-secondary/50 font-medium cursor-not-allowed" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground font-semibold flex items-center gap-1 h-4">
                        <Phone className="w-3 h-3 text-accent" /> Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone..." {...field} className="h-9 text-sm bg-secondary/30" />
                      </FormControl>
                      {form.formState.errors.phone && (
                        <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.phone.message}</p>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-muted-foreground font-semibold flex items-center gap-1 h-4">
                        <MapPin className="w-3 h-3 text-accent" /> Zip Code *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter zip code..." {...field} className="h-9 text-sm bg-secondary/30" />
                      </FormControl>
                      {form.formState.errors.zipcode && (
                        <p className="text-[10px] text-destructive mt-1 font-medium">{form.formState.errors.zipcode.message}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isApplying}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 text-sm sm:text-base rounded-xl shadow-md transition-all font-sans"
              >
                {isApplying ? "Submitting Application..." : "Confirm Application"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnrollmentForm;
