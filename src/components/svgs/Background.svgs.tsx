"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
      {/* Base background */}
      <div className="absolute inset-0 bg-zinc-950" />

      {/* Main gradient circle - Top right */}
      <div
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] lg:w-[1000px] lg:h-[1000px]"
        style={{
          top: "10%",
          right: "15%",
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(126, 34, 206, 0.15) 30%, rgba(126, 34, 206, 0.05) 70%, transparent 100%)",
          transform: "translate(25%, -25%)",
        }}
      />

      {/* Secondary gradient circle - Bottom left */}
      <div
        className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] lg:w-[900px] lg:h-[900px]"
        style={{
          bottom: "10%",
          left: "15%",
          background:
            "radial-gradient(circle, rgba(91, 33, 182, 0.2) 0%, rgba(76, 29, 149, 0.12) 30%, rgba(76, 29, 149, 0.04) 70%, transparent 100%)",
          transform: "translate(-25%, 25%)",
        }}
      />

      {/* Additional ambient gradients for depth */}
      <div
        className="absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px]"
        style={{
          top: "60%",
          right: "40%",
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(126, 34, 206, 0.03) 50%, transparent 100%)",
        }}
      />

      <div
        className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px]"
        style={{
          top: "20%",
          left: "60%",
          background:
            "radial-gradient(circle, rgba(91, 33, 182, 0.06) 0%, rgba(76, 29, 149, 0.02) 50%, transparent 100%)",
        }}
      />

      {/* Vertical gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(126, 34, 206, 0.04) 0%, transparent 50%, rgba(91, 33, 182, 0.06) 100%)",
        }}
      />

      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
