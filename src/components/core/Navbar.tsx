"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
  title: string;
  items: { title: string; time: string }[];
};

const navItems: NavItem = {
  title: "Timings",
  items: [
    {
      title: "Monday & Wednesday (2 batches) ",
      time: "11:00 A.M. > 01:00 P.M. | 04:00 P.M. > 06:00 P.M.",
    },
    {
      title: "Tuesday & Thursday (2 batches) ",
      time: "11:00 A.M. > 01:00 P.M. | 04:00 P.M. > 06:00 P.M.",
    },
    {
      title: "Sunday (Working Professionals) ",
      time: "11:00 A.M. > 01:00 P.M.",
    },
    {
      title: "Friday (Online Class) ",
      time: "11:00 A.M. > 01:00 P.M.",
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
    if (expandedSection === title) {
      setExpandedSection(null);
    } else {
      setExpandedSection(title);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileMenuOpen) {
      setActiveMobileSection(null);
    }
  };

  const toggleMobileSection = (title: string) => {
    if (activeMobileSection === title) {
      setActiveMobileSection(null);
    } else {
      setActiveMobileSection(title);
    }
  };

  const closeAll = () => {
    setExpandedSection(null);
    setMobileMenuOpen(false);
    setActiveMobileSection(null);
  };

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed md:bg-[#1a0129]/40  backdrop-blur-md text-[#F0C38E] z-10 w-full shadow-lg"
      >
        <motion.nav className="container mx-auto px-2">
          <div className="flex justify-between items-center h-20">
            <Link
              href="/"
              className="ml-3 md:ml-0 font-bold text-2xl flex items-center"
            >
              <AnimatePresence mode="wait">
                {showLogo ? (
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className=" border-b  border-r border-[#9370DB] hover:text-[#9370DB] shadow-lg shadow-[#9370DB]/50 rounded-md   mt-1 h-14 w-14 relative"
                  >
                    <Image
                      src="/icon.png"
                      alt="ASHAA Logo"
                      width={80}
                      height={80}
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
                  >
                    ASHAA
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4 font-sans text-2xl">
              <div key={navItems.title} className="relative flex flex-row">
                <Button
                  variant="ghost"
                  className="flex items-center font-semibold gap-1 text-[#F0C38E] hover:text-[#221F39] hover:bg-[#F0C38E]"
                  onClick={() => toggleDesktopSection(navItems.title)}
                >
                  {navItems.title}
                  <motion.div
                    animate={{
                      rotate: expandedSection === navItems.title ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                  </motion.div>
                </Button>

                <Button
                  variant="default"
                  className="flex ml-2 font-semibold items-center gap-1 text-[#221F39] hover:text-[#F0C38E] bg-[#F0C38E]"
                >
                  <p>+91 9147714547</p>
                </Button>

                <AnimatePresence>
                  {expandedSection === navItems.title && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 bg-[#110016]/90 backdrop-blur-md rounded-md  z-50 md:min-w-[450px] border border-[#F0C38E]/20"
                    >
                      <div className="p-3 flex flex-col">
                        {navItems.items.map((subItem, index) => (
                          <div key={index}>
                            <p
                              className="block py-2 px-3 text-base hover:bg-[#F0C38E]/10 rounded transition-colors"
                              onClick={closeAll}
                            >
                              {subItem.title}
                              <ChevronDown className="animate-bounce" />
                            </p>

                            <p
                              className="block py-2 px-3 text-gray-400 text-base hover:bg-[#F0C38E]/10 rounded transition-colors"
                              onClick={closeAll}
                            >
                              {subItem.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden mr-3 bg-[#F0C38E]/90  text-[#221F39]"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-10 w-10 animate-pulse" />
              ) : (
                <Menu className="h-10 w-10 animate-pulse" />
              )}
            </Button>
          </div>
        </motion.nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-20 left-0 w-full bg-black/70 backdrop-blur-md text-[#F0C38E] z-20 overflow-hidden"
          >
            <div className="p-4 overflow-y-auto h-full">
              <div key={navItems.title} className="mb-4">
                <motion.button
                  className="flex items-center justify-between w-full text-xl font-semibold py-3 border-b border-[#F0C38E]/20"
                  onClick={() => toggleMobileSection(navItems.title)}
                  whileTap={{ scale: 0.98 }}
                >
                  {navItems.title}
                  <motion.div
                    animate={{
                      rotate: activeMobileSection === navItems.title ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 animate-bounce" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {activeMobileSection === navItems.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 ml-4 space-y-1 py-2">
                        {navItems.items.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <p
                              className="block py-2 px-3 text-base hover:bg-[#F0C38E]/10 rounded transition-colors"
                              onClick={closeAll}
                            >
                              {item.title}
                              <ChevronDown className="animate-bounce" />
                            </p>

                            <p
                              className="block py-2 px-3 text-base text-gray-400 hover:bg-[#F0C38E]/10 rounded transition-colors"
                              onClick={closeAll}
                            >
                              {item.time}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col mx-auto  gap-4 ">
                <Button
                  variant="default"
                  className="flex ml-2 font-semibold justify-start items-center gap-1 text-[#221F39]  bg-[#F0C38E]"
                >
                  <p>Phone: +91 9147714547</p>
                </Button>

                <Button
                  variant="default"
                  className="flex ml-2 font-semibold justify-start items-center gap-1 text-[#221F39]  bg-[#F0C38E]"
                >
                  <p>Email: ashaafoundation25@gmail.com</p>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for closing when clicking outside */}
      <AnimatePresence>
        {(expandedSection || mobileMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-10"
            onClick={closeAll}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
