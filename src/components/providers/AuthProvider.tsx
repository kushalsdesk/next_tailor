"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Ban } from "lucide-react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    // Mount Firebase Auth Listener
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  if (user?.isBlocked && !isAuthLoading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-4 z-[9999]">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <Ban className="w-16 h-16 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Account Suspended</h1>
        <p className="text-muted-foreground text-center max-w-md text-lg">
          Your access to the platform has been restricted. All active applications and chats have been frozen. 
          Please contact administration if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
