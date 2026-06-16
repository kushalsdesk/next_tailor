"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener);

  useEffect(() => {
    // Mount Firebase Auth Listener
    const unsubscribe = initializeAuthListener();
    return () => unsubscribe();
  }, [initializeAuthListener]);

  return <>{children}</>;
}
