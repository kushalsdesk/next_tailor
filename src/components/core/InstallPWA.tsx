"use client";
import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallPWA() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent native mini-infobar
      setDeferredPrompt(e);
      // Always show custom popup if they haven't explicitly dismissed it recently
      if (localStorage.getItem("pwa-dismissed") !== "true") {
        setShowPrompt(true);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Setting to true ensures it stays hidden for a while if user dismisses it manually
    localStorage.setItem("pwa-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-10">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold">Install ASHAA App</h4>
          <p className="text-sm opacity-90">Install our app for faster access, gallery streaming, and offline viewing.</p>
        </div>
        <button onClick={handleDismiss} className="p-1 hover:bg-black/20 rounded-md transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <Button onClick={handleInstall} className="w-full bg-white text-primary hover:bg-gray-100 font-bold shadow-md">
        <Download className="w-4 h-4 mr-2" /> Install Now
      </Button>
    </div>
  );
}
