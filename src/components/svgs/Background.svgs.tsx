"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#110016]" />

      {/* Layer 1 - Largest background boxes */}
      <div
        className="absolute w-96 h-96 sm:w-[500px] sm:h-[400px] lg:w-[600px] lg:h-[500px]"
        style={{
          top: "-10%",
          right: "-5%",
          background:
            "linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(126, 34, 206, 0.04) 100%)",
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 25px 50px rgba(147, 51, 234, 0.06)",
          transform: "rotate(-15deg)",
        }}
      />

      <div
        className="absolute w-80 h-80 sm:w-[450px] sm:h-[350px] lg:w-[550px] lg:h-[450px]"
        style={{
          bottom: "-10%",
          left: "-5%",
          background:
            "linear-gradient(225deg, rgba(91, 33, 182, 0.07) 0%, rgba(76, 29, 149, 0.03) 100%)",
          borderRadius: "20px",
          backdropFilter: "blur(18px)",
          boxShadow: "0 20px 40px rgba(91, 33, 182, 0.05)",
          transform: "rotate(12deg)",
        }}
      />

      {/* Layer 2 - Large overlapping boxes */}
      <motion.div
        className="absolute w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
        style={{
          top: "15%",
          right: "20%",
          background:
            "linear-gradient(45deg, rgba(147, 51, 234, 0.06) 0%, rgba(168, 85, 247, 0.03) 100%)",
          borderRadius: "18px",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(147, 51, 234, 0.08)",
          boxShadow: "0 15px 30px rgba(147, 51, 234, 0.04)",
          transform: "rotate(-8deg)",
        }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80"
        style={{
          top: "25%",
          right: "10%",
          background:
            "linear-gradient(315deg, rgba(126, 34, 206, 0.05) 0%, rgba(147, 51, 234, 0.025) 100%)",
          borderRadius: "16px",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(126, 34, 206, 0.06)",
          boxShadow: "0 12px 24px rgba(126, 34, 206, 0.03)",
          transform: "rotate(5deg)",
        }}
        animate={{
          y: [0, 6, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-60 h-60 sm:w-68 sm:h-68 lg:w-76 lg:h-76"
        style={{
          bottom: "25%",
          left: "15%",
          background:
            "linear-gradient(135deg, rgba(91, 33, 182, 0.06) 0%, rgba(76, 29, 149, 0.03) 100%)",
          borderRadius: "14px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(91, 33, 182, 0.07)",
          boxShadow: "0 10px 20px rgba(91, 33, 182, 0.04)",
          transform: "rotate(-12deg)",
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 18,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
        style={{
          bottom: "35%",
          left: "25%",
          background:
            "linear-gradient(225deg, rgba(147, 51, 234, 0.04) 0%, rgba(168, 85, 247, 0.02) 100%)",
          borderRadius: "12px",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(147, 51, 234, 0.05)",
          boxShadow: "0 8px 16px rgba(147, 51, 234, 0.03)",
          transform: "rotate(18deg)",
        }}
        animate={{
          y: [0, 4, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Layer 3 - Medium overlapping boxes */}
      <div
        className="absolute w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64"
        style={{
          top: "40%",
          right: "35%",
          background:
            "linear-gradient(45deg, rgba(126, 34, 206, 0.04) 0%, rgba(91, 33, 182, 0.02) 100%)",
          borderRadius: "10px",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(126, 34, 206, 0.04)",
          boxShadow: "0 6px 12px rgba(126, 34, 206, 0.02)",
          transform: "rotate(-5deg)",
        }}
      />

      <div
        className="absolute w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60"
        style={{
          top: "50%",
          right: "25%",
          background:
            "linear-gradient(315deg, rgba(147, 51, 234, 0.035) 0%, rgba(126, 34, 206, 0.018) 100%)",
          borderRadius: "8px",
          backdropFilter: "blur(5px)",
          border: "1px solid rgba(147, 51, 234, 0.03)",
          boxShadow: "0 4px 8px rgba(147, 51, 234, 0.02)",
          transform: "rotate(10deg)",
        }}
      />

      <div
        className="absolute w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
        style={{
          top: "60%",
          left: "40%",
          background:
            "linear-gradient(135deg, rgba(91, 33, 182, 0.04) 0%, rgba(76, 29, 149, 0.02) 100%)",
          borderRadius: "6px",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(91, 33, 182, 0.03)",
          boxShadow: "0 3px 6px rgba(91, 33, 182, 0.015)",
          transform: "rotate(-15deg)",
        }}
      />

      <div
        className="absolute w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52"
        style={{
          top: "70%",
          left: "50%",
          background:
            "linear-gradient(225deg, rgba(147, 51, 234, 0.03) 0%, rgba(168, 85, 247, 0.015) 100%)",
          borderRadius: "4px",
          backdropFilter: "blur(3px)",
          border: "1px solid rgba(147, 51, 234, 0.025)",
          boxShadow: "0 2px 4px rgba(147, 51, 234, 0.01)",
          transform: "rotate(8deg)",
        }}
      />

      {/* Layer 4 - Small overlapping boxes */}
      <div
        className="absolute w-32 h-32 sm:w-40 sm:h-40"
        style={{
          top: "20%",
          left: "60%",
          background:
            "linear-gradient(45deg, rgba(126, 34, 206, 0.03) 0%, rgba(91, 33, 182, 0.015) 100%)",
          borderRadius: "6px",
          backdropFilter: "blur(3px)",
          boxShadow: "0 2px 4px rgba(126, 34, 206, 0.01)",
          transform: "rotate(-20deg)",
        }}
      />

      <div
        className="absolute w-28 h-28 sm:w-36 sm:h-36"
        style={{
          top: "30%",
          left: "70%",
          background:
            "linear-gradient(315deg, rgba(147, 51, 234, 0.025) 0%, rgba(126, 34, 206, 0.012) 100%)",
          borderRadius: "4px",
          backdropFilter: "blur(2px)",
          boxShadow: "0 1px 2px rgba(147, 51, 234, 0.008)",
          transform: "rotate(25deg)",
        }}
      />

      <div
        className="absolute w-24 h-24 sm:w-32 sm:h-32"
        style={{
          bottom: "60%",
          left: "10%",
          background:
            "linear-gradient(135deg, rgba(91, 33, 182, 0.025) 0%, rgba(76, 29, 149, 0.012) 100%)",
          borderRadius: "3px",
          backdropFilter: "blur(2px)",
          boxShadow: "0 1px 2px rgba(91, 33, 182, 0.008)",
          transform: "rotate(-30deg)",
        }}
      />

      <div
        className="absolute w-20 h-20 sm:w-28 sm:h-28"
        style={{
          bottom: "50%",
          left: "5%",
          background:
            "linear-gradient(225deg, rgba(147, 51, 234, 0.02) 0%, rgba(168, 85, 247, 0.01) 100%)",
          borderRadius: "2px",
          backdropFilter: "blur(1px)",
          boxShadow: "0 0.5px 1px rgba(147, 51, 234, 0.005)",
          transform: "rotate(35deg)",
        }}
      />

      {/* Layer 5 - Very small accent boxes */}
      <div
        className="absolute w-16 h-16 sm:w-24 sm:h-24"
        style={{
          top: "80%",
          right: "60%",
          background: "rgba(126, 34, 206, 0.02)",
          borderRadius: "2px",
          boxShadow: "0 0.5px 1px rgba(126, 34, 206, 0.004)",
          transform: "rotate(-40deg)",
        }}
      />

      <div
        className="absolute w-12 h-12 sm:w-20 sm:h-20"
        style={{
          top: "10%",
          left: "40%",
          background: "rgba(147, 51, 234, 0.018)",
          borderRadius: "1px",
          boxShadow: "0 0.25px 0.5px rgba(147, 51, 234, 0.003)",
          transform: "rotate(45deg)",
        }}
      />

      {/* Subtle ambient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(147, 51, 234, 0.01) 0%, transparent 50%, rgba(91, 33, 182, 0.015) 100%)",
        }}
      />
    </div>
  );
}
