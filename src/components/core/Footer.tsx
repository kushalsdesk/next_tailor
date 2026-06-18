"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-black text-neutral-300 py-16 relative overflow-hidden border-t border-neutral-900">
      {/* Subtle glowing blob effect in background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center p-2">
                <Image
                  src="/icon.png"
                  alt="ASHAA"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-serif font-bold text-3xl text-white tracking-wide group-hover:text-primary transition-colors">
                ASHAA
              </span>
            </Link>
            <p className="text-neutral-400 font-sans leading-relaxed">
              Empowering dreams through premium fashion education. Turn your
              passion into a thriving professional career with our expert
              guidance.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-bold text-xl text-white mb-6">
              Explore
            </h3>
            <ul className="space-y-4 font-sans font-medium">
              <li>
                <Link
                  href="#courses"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="#application"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  Admissions
                </Link>
              </li>
              <li>
                <Link
                  href="#career"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  Career Paths
                </Link>
              </li>
              <li>
                <Link
                  href="#tools"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  Provided Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-serif font-bold text-xl text-white mb-6">
              Company
            </h3>
            <ul className="space-y-4 font-sans font-medium">
              <li>
                <Link
                  href="#about"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary flex items-center gap-1 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary flex items-center gap-2 group transition-colors"
                >
                  <span className="w-2 h-2 bg-neutral-800 rounded-full group-hover:bg-primary transition-colors"></span>
                  Student Portal <ArrowUpRight className="w-3 h-3 opacity-50" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-bold text-xl text-white mb-6">
              Get in Touch
            </h3>
            <ul className="space-y-5 font-sans">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-neutral-400 leading-snug">
                  Kalibari Girls School Road, New Barrackpore, Kolkata, West
                  Bengal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-neutral-400 font-medium">
                  +91 9147714547
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-neutral-400 font-medium">
                  ashaafoundation25@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 font-sans text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} ASHAA Foundation. All rights
            reserved.
          </p>
          <div className="text-neutral-600 font-serif font-bold text-xl tracking-widest uppercase">
            Ashaa
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
