"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import DonateButton from "../DonateButton/DonateButton";

export default function MobileDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 w-80 h-screen bg-white shadow-2xl z-[200] p-6 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#022741]">Menu</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-[#022741]" />
            </button>
          </div>

          {/* Hardcoded Menu */}
          <ul className="space-y-4">
            <li>
              <Link href="/" className="block text-[#022741] font-medium">
                Home
              </Link>
            </li>

            <li>
              <p className="font-semibold text-[#022741]">Who We Are?</p>
              <ul className="pl-4 space-y-2 mt-2 text-gray-600">
                <li><Link href="/overview">Overview</Link></li>
                <li><Link href="/missionview">Vision & Mission</Link></li>
                <li><Link href="/our-team">Our Team</Link></li>
                <li><Link href="/certificate">Certificate</Link></li>
              </ul>
            </li>

            <li>
              <p className="font-semibold text-[#022741]">What We Do?</p>
              <ul className="pl-4 space-y-2 mt-2 text-gray-600">
                <li><Link href="/education">Education</Link></li>
                <li><Link href="/healthcare">Healthcare</Link></li>
                <li><Link href="/women-empowerment">Women Empowerment</Link></li>
              </ul>
            </li>

            <li>
              <p className="font-semibold text-[#022741]">News & Stories</p>
              <ul className="pl-4 space-y-2 mt-2 text-gray-600">
                <li><Link href="/photo-gallery">Photo Gallery</Link></li>
                <li><Link href="/video-gallery">Video Gallery</Link></li>
                <li><Link href="/resources">Resources</Link></li>
              </ul>
            </li>

            <li>
              <p className="font-semibold text-[#022741]">Get Involved</p>
              <ul className="pl-4 space-y-2 mt-2 text-gray-600">
                <li><Link href="/work-with-us">Work With Us</Link></li>
                <li><Link href="/corporate-partnership">Corporate Partnership</Link></li>
              </ul>
            </li>

            <li>
              <Link href="/blog" className="block text-[#022741] font-medium">
                Blog
              </Link>
            </li>

            <li>
              <Link href="/contact" className="block text-[#022741] font-medium">
                Contact Us
              </Link>
            </li>
          </ul>

          {/* Donate Button */}
          <div className="mt-6">
            <DonateButton size="large" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}