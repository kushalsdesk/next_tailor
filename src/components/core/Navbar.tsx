"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, Phone, Mail, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  title: string;
  items: { title: string; time: string }[];
};

const timings: NavItem = {
  title: "Timings",
  items: [
    {
      title: "Monday & Wednesday",
      time: "11:00 AM - 01:00 PM | 04:00 PM - 06:00 PM",
    },
    {
      title: "Tuesday & Thursday",
      time: "11:00 AM - 01:00 PM | 04:00 PM - 06:00 PM",
    },
    {
      title: "Sunday (Working Professionals)",
      time: "11:00 AM - 01:00 PM",
    },
    {
      title: "Friday (Online Class)",
      time: "11:00 AM - 01:00 PM",
    },
  ],
};

const Navbar = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSection, setActiveMobileSection] = useState<string | null>(
    null,
  );
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleDesktopSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileMenuOpen) setActiveMobileSection(null);
  };

  const toggleMobileSection = (title: string) => {
    setActiveMobileSection(activeMobileSection === title ? null : title);
  };

  const closeAll = () => {
    setExpandedSection(null);
    setMobileMenuOpen(false);
    setActiveMobileSection(null);
  };

  const scrollToSection = (id: string) => {
    closeAll();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50 shadow-sm"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo area */}
            <Link
              href="/"
              className="font-serif font-bold text-2xl flex items-center text-foreground z-50 relative w-32"
            >
              <AnimatePresence mode="wait">
                {showLogo ? (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center h-12 w-12 absolute left-0 bg-primary rounded-xl border border-primary/20"
                  >
                    <Image
                      src="/icon.png"
                      alt="ASHAA Logo"
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 tracking-widest font-serif font-bold text-3xl"
                    style={{ 
                      WebkitTextStroke: "1.5px hsl(var(--primary))", 
                      WebkitTextFillColor: "transparent" 
                    }}
                  >
                    ASHAA
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 font-sans font-medium text-foreground">
              <button
                onClick={() => scrollToSection("courses")}
                className="hover:text-primary transition-colors"
              >
                Courses
              </button>
              <button
                onClick={() => scrollToSection("career")}
                className="hover:text-primary transition-colors"
              >
                Career
              </button>

              <div className="relative">
                <button
                  onClick={() => toggleDesktopSection(timings.title)}
                  className={`flex items-center gap-1 transition-colors ${expandedSection === timings.title ? "text-primary" : "hover:text-primary"}`}
                >
                  {timings.title}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${expandedSection === timings.title ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {expandedSection === timings.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-6 bg-card border border-border shadow-xl rounded-xl z-50 min-w-[380px] overflow-hidden"
                    >
                      <div className="p-2">
                        {timings.items.map((subItem, index) => (
                          <div
                            key={index}
                            className="p-4 hover:bg-secondary rounded-lg transition-colors border-b border-border/50 last:border-0"
                          >
                            <p className="font-semibold text-foreground mb-1 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-accent" />
                              {subItem.title}
                            </p>
                            <p className="text-muted-foreground text-sm pl-6">
                              {subItem.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center pl-4 border-l border-border">
                <Button className="font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md rounded-full px-6">
                  <Phone className="w-4 h-4" />
                  +91 9147714547
                </Button>
              </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-secondary hover:text-primary"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation - Solid Full Screen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-20 bg-background z-40 overflow-y-auto border-t border-border"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
              <button
                onClick={() => scrollToSection("courses")}
                className="text-2xl font-serif font-bold text-left text-foreground py-2 border-b border-border"
              >
                Courses
              </button>

              <button
                onClick={() => scrollToSection("career")}
                className="text-2xl font-serif font-bold text-left text-foreground py-2 border-b border-border"
              >
                Career Opportunities
              </button>

              <div className="border-b border-border pb-4">
                <button
                  className="flex items-center justify-between w-full text-2xl font-serif font-bold text-foreground py-2"
                  onClick={() => toggleMobileSection(timings.title)}
                >
                  {timings.title}
                  <ChevronDown
                    className={`h-6 w-6 transition-transform duration-300 ${activeMobileSection === timings.title ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {activeMobileSection === timings.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 space-y-4 bg-card rounded-xl border border-border p-4">
                        {timings.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="pb-4 border-b border-border last:border-0 last:pb-0"
                          >
                            <p className="font-semibold text-foreground flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-accent" />
                              {item.title}
                            </p>
                            <p className="text-muted-foreground text-sm pl-6">
                              {item.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <Button className="w-full justify-start py-6 text-md font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md gap-3">
                  <Phone className="w-5 h-5" />
                  +91 9147714547
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start py-6 text-md font-semibold bg-card border-border hover:bg-secondary text-foreground rounded-xl gap-3"
                >
                  <Mail className="w-5 h-5 text-accent" />
                  ashaafoundation25@gmail.com
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional: Add a spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-20 w-full" aria-hidden="true" />
    </>
  );
};

export default Navbar;
