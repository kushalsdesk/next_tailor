"use client";

import { useEffect, useRef } from "react";

const Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      // Use the full document height instead of just viewport height
      const documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight,
        window.innerHeight,
      );

      canvas.width = window.innerWidth;
      canvas.height = documentHeight;
      draw();
    };

    // Initial setup
    window.addEventListener("resize", handleResize);

    // Also listen for content changes that might affect document height
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(document.body);

    // Initial call
    handleResize();

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Use canvas dimensions for gradient calculations
      const mainGradient = ctx.createRadialGradient(
        canvas.width * 0.8,
        canvas.height * 0.2,
        0,
        canvas.width * 0.8,
        canvas.height * 0.2,
        canvas.width * 0.7,
      );
      mainGradient.addColorStop(0, "rgba(147, 51, 234, 0.15)"); // Purple-600
      mainGradient.addColorStop(0.5, "rgba(126, 34, 206, 0.05)"); // Purple-700
      mainGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      const secondaryGradient = ctx.createRadialGradient(
        canvas.width * 0.2,
        canvas.height * 0.8,
        0,
        canvas.width * 0.2,
        canvas.height * 0.8,
        canvas.width * 0.6,
      );
      secondaryGradient.addColorStop(0, "rgba(91, 33, 182, 0.1)"); // Purple-800
      secondaryGradient.addColorStop(0.6, "rgba(76, 29, 149, 0.03)"); // Purple-900
      secondaryGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = mainGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = secondaryGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const verticalGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      verticalGradient.addColorStop(0, "rgba(126, 34, 206, 0.03)"); // Purple-700
      verticalGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
      verticalGradient.addColorStop(1, "rgba(91, 33, 182, 0.05)"); // Purple-800

      ctx.fillStyle = verticalGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full -z-10"
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -10,
        background: "#09090b", // zinc-950 equivalent
        minHeight: "100vh", // Fallback for very short content
      }}
      aria-hidden="true"
    />
  );
};

export default Background;
