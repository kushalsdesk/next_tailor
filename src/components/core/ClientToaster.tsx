"use client";

import { Toaster } from "sonner";
import { useEffect, useState } from "react";

export default function ClientToaster() {
  const [position, setPosition] = useState<"bottom-center" | "bottom-right">("bottom-right");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setPosition("bottom-center");
      } else {
        setPosition("bottom-right");
      }
    };

    // Set initial position
    handleResize();
    
    // Listen for resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <Toaster richColors position={position} />;
}
