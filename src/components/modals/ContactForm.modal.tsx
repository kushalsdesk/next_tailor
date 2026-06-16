"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { MessageCircle, LogOut, Phone, Send, Info } from "lucide-react";
import Image from "next/image";

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

const formSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  careerOption: z.string().optional(),
  message: z.string().min(1, { message: "Message cannot be empty." }),
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
  const [mockMessages, setMockMessages] = useState<{id: number, text: string, sender: 'user' | 'admin'}[]>([]);

  // Zustand Global State
  const { user, isAuthenticated, signInWithGoogle, logout } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      careerOption: selectedCareer || "",
      message: "",
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
    setIsSubmitting(true);
    
    // Add message to mock UI
    const newMsg = { id: Date.now(), text: values.message, sender: 'user' as const };
    setMockMessages(prev => [...prev, newMsg]);

    try {
      const payload = {
        ...values,
        name: user?.displayName,
        email: user?.email,
      };

      const response = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit form");
      
      form.setValue("message", ""); // Clear input
      toast.success("Message Sent Successfully!");
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  // --- UI STATE 1: NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-card/50 border border-border border-dashed rounded-2xl h-full min-h-[400px]">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-sm border border-border">
          <MessageCircle className="w-10 h-10 text-primary" />
        </div>
        <h4 className="text-2xl font-serif font-bold text-foreground mb-3">Sign in to Connect</h4>
        <p className="text-muted-foreground mb-8 max-w-sm font-sans text-base">
          Sign in with your Google account to securely chat with our experts regarding <strong className="text-foreground">{selectedCareer}</strong>.
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

  // --- UI STATE 2: AUTHENTICATED CHAT INTERFACE ---
  return (
    <div className="flex flex-col h-full space-y-6">
      
      {/* 1. Mobile-Optimized Profile Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-sm shrink-0">
            <Image 
              src={user?.photoURL || "/placeholder.svg"} 
              alt="Profile" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="font-bold font-sans text-foreground leading-tight truncate">{user?.displayName}</p>
            <p className="text-sm font-sans text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={logout} 
          className="w-full sm:w-auto text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors shrink-0"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1">
          
          {/* 2. Configuration & Metadata Section */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Inquiry Context</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-semibold flex items-center gap-1 h-4">
                      <Phone className="w-3 h-3 text-accent" /> Phone Number (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone..." {...field} className="h-9 text-sm bg-secondary/30" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="careerOption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground font-semibold h-4 flex items-center">Selected Path</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="h-9 text-sm bg-secondary/50 font-medium cursor-not-allowed" />
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
                    <FormLabel className="text-xs font-semibold cursor-pointer">Subscribe</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="getTips"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">Get Tips</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellCreation"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">Sell Creation</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanFacility"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between bg-secondary/20 rounded-lg p-2 border border-border/50">
                    <FormLabel className="text-xs font-semibold cursor-pointer">Loan Facility</FormLabel>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} className="scale-75" /></FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 3. Real Chatbox UI */}
          <div className="flex flex-col border border-border rounded-xl overflow-hidden bg-card h-[400px] shadow-sm">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
              
              {/* Automated Welcome Message */}
              <div className="flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Image src="/icon.png" alt="Admin" width={20} height={20} className="object-contain" />
                </div>
                <div className="bg-white border border-border rounded-2xl rounded-tl-sm p-3 shadow-sm">
                  <p className="text-sm text-foreground">
                    Hi {user?.displayName?.split(' ')[0] || 'there'}! 👋<br/><br/>
                    I see you&apos;re interested in <strong>{selectedCareer}</strong>. Our counselors are ready to guide you. Do you have any specific questions before we begin?
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-2 block">Automated Message</span>
                </div>
              </div>

              {/* User Messages */}
              {mockMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] self-end ml-auto justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-3 shadow-sm">
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">Sent</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-card border-t border-border">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex items-end gap-2 space-y-0">
                    <FormControl>
                      <Textarea 
                        placeholder="Type your message..." 
                        {...field}
                        className="min-h-[50px] max-h-[120px] resize-none border-border focus-visible:ring-primary px-3 py-3 bg-background rounded-xl"
                        onKeyDown={(e) => {
                          // Allow Ctrl+Enter or Cmd+Enter to submit
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !field.value.trim()} 
                      className="shrink-0 rounded-full w-12 h-12 p-0 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-5 h-5 -ml-0.5" />
                    </Button>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
