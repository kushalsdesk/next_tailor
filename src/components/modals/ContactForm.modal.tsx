"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Phone, Info } from "lucide-react";

const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path
        fill="#4285F4"
        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
      />
      <path
        fill="#34A853"
        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
      />
      <path
        fill="#FBBC05"
        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
      />
      <path
        fill="#EA4335"
        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
      />
    </g>
  </svg>
);

const formSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  careerOption: z.string().optional(),
  subscribe: z.boolean().default(false),
  getTips: z.boolean().default(false),
  sellCreation: z.boolean().default(false),
  loanFacility: z.boolean().default(false),
});

interface ContactFormProps {
  selectedCareer: string | null;
  onClose?: () => void;
}

export default function ContactForm({ selectedCareer }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zustand Global State
  const { isAuthenticated, user, signInWithGoogle } = useAuthStore();

  const { data, mutate, isLoading } = useSWR(
    isAuthenticated && user?.uid ? `/api/inquiries?userId=${user.uid}` : null,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      careerOption: selectedCareer || "",
      subscribe: false,
      getTips: false,
      sellCreation: false,
      loanFacility: false,
    },
  });

  useEffect(() => {
    form.setValue("careerOption", selectedCareer || "");
  }, [selectedCareer, form]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch {
      toast.error("Failed to sign in with Google.");
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: user.displayName || "",
          email: user.email,
          ...values,
        }),
      });

      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Failed to submit application");

      toast.success("Application details submitted successfully!");
      mutate();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to submit. Please try again.",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteApplication = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result.error || "Failed to delete application");

      toast.success("Previous application cleared. You can now apply again!");
      mutate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete application.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-card/50 border border-border border-dashed rounded-2xl h-full min-h-[400px]">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <Info className="w-10 h-10 text-primary" />
        </div>
        <h4 className="text-2xl font-serif font-bold text-foreground mb-3">
          Sign in to Connect
        </h4>
        <p className="text-muted-foreground mb-8 max-w-sm font-sans text-base">
          Sign in with your Google account to securely register your interest in{" "}
          <strong className="text-foreground">{selectedCareer}</strong>.
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

  const existingApp = data?.applications?.[0];

  if (existingApp) {
    if (existingApp.status === "rejected") {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-card/50 rounded-2xl border border-border">
          <svg
            className="w-12 h-12 text-destructive mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <h4 className="text-2xl font-serif font-bold text-foreground mb-2">
            Application Rejected
          </h4>
          <p className="text-muted-foreground mb-6 font-sans text-base max-w-md">
            Hey, sorry, your previous inquiry for{" "}
            <strong className="text-foreground">{existingApp.path}</strong> got
            rejected. You can clear this status and try submitting a newer
            inquiry.
          </p>
          <Button
            onClick={() => handleDeleteApplication(existingApp._id as string)}
            disabled={isDeleting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 px-6 rounded-xl shadow-md transition-all font-sans"
          >
            {isDeleting ? "Clearing..." : "Try Newer Inquiry"}
          </Button>
        </div>
      );
    }

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "accepted":
          return (
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          );
        case "reviewed":
          return <Info className="w-12 h-12 text-yellow-500 mb-4" />;
        default:
          return (
            <svg
              className="w-12 h-12 text-blue-500 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          );
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-card/50 rounded-2xl border border-border">
        {getStatusIcon(existingApp.status)}
        <h4 className="text-2xl font-serif font-bold text-foreground mb-2">
          Inquiry Submitted
        </h4>
        <p className="text-muted-foreground mb-4 font-sans text-base">
          You already have an active inquiry for{" "}
          <strong className="text-foreground">{existingApp.path}</strong>.
        </p>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Status:</span>
          <div
            className={`capitalize text-sm px-3 py-1 rounded-full border ${
              existingApp.status === "accepted"
                ? "text-green-500 border-green-500 bg-green-500/10"
                : existingApp.status === "reviewed"
                  ? "text-yellow-500 border-yellow-500 bg-yellow-500/10"
                  : "text-blue-500 border-blue-500 bg-blue-500/10"
            }`}
          >
            {existingApp.status}
          </div>
        </div>
      </div>
    );
  }

  // --- UI STATE 3: AUTHENTICATED FORM ---
  return (
    <div className="flex flex-col h-full space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 flex-1"
        >
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Application Details
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-semibold flex items-center gap-1 h-4">
                      <Phone className="w-3 h-3 text-accent" /> Phone Number *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter phone..."
                        {...field}
                        className="h-9 text-sm bg-secondary/30"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="careerOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-semibold h-4 flex items-center">
                      Selected Path
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="h-9 text-sm bg-secondary/50 font-medium cursor-not-allowed"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Compact Toggle Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <FormField
                control={form.control}
                name="subscribe"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">
                      Subscribe
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-75"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="getTips"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">
                      Get Tips
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-75"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellCreation"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">
                      Sell Creation
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-75"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanFacility"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">
                      Loan Facility
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-75"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 text-sm sm:text-base rounded-xl shadow-md transition-all font-sans"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
