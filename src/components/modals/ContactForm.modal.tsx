"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(5, { message: "Name must be at least 5 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  careerOption: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
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
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      careerOption: selectedCareer || "",
      message: "",
      subscribe: false,
      getTips: false,
      sellCreation: false,
      loanFacility: false,
    },
  });

  // Re-sync if parent updates the career dynamically
  useEffect(() => {
    form.setValue("careerOption", selectedCareer || "");
  }, [selectedCareer, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setProgress(0);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 10));
      }, 500);

      const response = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      clearInterval(interval);
      if (!response.ok) throw new Error("Failed to submit form");
      
      setProgress(100);
      form.reset({ careerOption: selectedCareer || "" });
      toast.success("Contact Details Submitted Successfully!", {
        description: `We will connect with you shortly regarding ${selectedCareer || 'your inquiry'}.`,
      });
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setProgress(0);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} className="bg-card border-border text-foreground focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormMessage className="text-destructive font-medium text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground font-semibold">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} className="bg-card border-border text-foreground focus:border-primary focus:ring-primary" />
                </FormControl>
                <FormMessage className="text-destructive font-medium text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} className="bg-card border-border text-foreground focus:border-primary focus:ring-primary" />
              </FormControl>
              <FormMessage className="text-destructive font-medium text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="careerOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">Career Option</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-secondary border-border text-muted-foreground cursor-not-allowed" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground font-semibold">Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help you?" {...field} className="bg-card border-border text-foreground focus:border-primary focus:ring-primary min-h-[100px]" />
              </FormControl>
              <FormMessage className="text-destructive font-medium text-xs" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
          <FormField
            control={form.control}
            name="subscribe"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center justify-between rounded-lg border border-border p-4 bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-foreground font-semibold">Register / Subscribe</FormLabel>
                  <FormDescription className="text-xs text-muted-foreground">Receive updates about our services.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="getTips"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center justify-between rounded-lg border border-border p-4 bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-foreground font-semibold">Get Help with Tips</FormLabel>
                  <FormDescription className="text-xs text-muted-foreground">Receive helpful guidance.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellCreation"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center justify-between rounded-lg border border-border p-4 bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-foreground font-semibold">Sell Your Creation</FormLabel>
                  <FormDescription className="text-xs text-muted-foreground">Help selling your products.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loanFacility"
            render={({ field }) => (
              <FormItem className="flex flex-row gap-4 items-center justify-between rounded-lg border border-border p-4 bg-card">
                <div className="space-y-0.5">
                  <FormLabel className="text-foreground font-semibold">Loan Facility</FormLabel>
                  <FormDescription className="text-xs text-muted-foreground">MSME Guidance included.</FormDescription>
                </div>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg rounded-xl shadow-lg shadow-primary/20 transition-all font-sans">
            {isSubmitting ? "Submitting..." : "Send Message"}
          </Button>

          {isSubmitting && (
            <Progress value={progress} className="h-2 mt-4" />
          )}
        </div>
      </form>
    </Form>
  );
}
