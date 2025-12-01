"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown } from "lucide-react";

import MobileDrawer from "./MobileDrawer";
import DonateButton from "../DonateButton/DonateButton";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navLinks = [
    {
      label: "Who We Are?",
      subLinks: [
        { href: "/overview", label: "Overview" },
        { href: "/missionview", label: "Vision & Mission" },
        { href: "/our-team", label: "Our Team" },
        { href: "/volunteers", label: "Our Volunteers" },
        { href: "/certificate", label: "Certificate" },
      ],
    },
    {
      label: "What We Do?",
      subLinks: [
        { href: "/agriculture", label: "Agriculture" },
        { href: "/education", label: "Education" },
        { href: "/healthcare", label: "HealthCare" },
        { href: "/women-empowerment", label: "Women Empowerment" },
      ],
    },
    {
      label: "News & Stories",
      subLinks: [
        { href: "/photo-gallery", label: "Photo Gallery" },
        { href: "/video-gallery", label: "Video Gallery" },
        { href: "/resources", label: "Resources" },
      ],
    },
    {
      label: "Get Involved",
      subLinks: [
        { href: "/work-with-us", label: "Work With Us" },
        { href: "/apply-volunteer", label: "Apply Volunteer" },
        { href: "/corporate-partnership", label: "Corporate Partnership" },
      ],
    },

  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-[100] border-b border-gray-100">
      <div className="mx-auto px-2 sm:px-2 lg:px-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#022741] shadow-md"
            >
              <span className="text-white font-bold text-lg">P</span>
            </motion.div>
            <span className="font-bold text-xl text-[#022741]">
              Prayas by Aarya Foundation
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(idx)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center text-[#022741] font-medium hover:text-[#0b4975]">
                  {link.label}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                <AnimatePresence>
                  {openDropdown === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-52 bg-white border rounded-xl shadow-lg p-2"
                    >
                      {link.subLinks.map((sub, i) => (
                        <Link
                          key={i}
                          href={sub.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link
              href="/blog"
              className="font-medium text-[#022741] hover:text-[#0b4975]"
            >
              Blog
            </Link>
            <Link
              href="/reach-us"
              className="font-medium text-[#022741] hover:text-[#0b4975]"
            >
              Contact Us
            </Link>
            <DonateButton size="small" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden text-[#022741]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </nav>
  );
}