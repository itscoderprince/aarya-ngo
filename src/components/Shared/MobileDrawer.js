"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, UserPlus } from "lucide-react";
import DonateButton from "../DonateButton/DonateButton";

export default function MobileDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[190] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[85%] max-w-sm h-screen bg-white shadow-2xl z-[200] overflow-y-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-8 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <span>
                <Link href="/" onClick={onClose} className="block text-[#022741] font-bold text-lg">
                  Home
                </Link>
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#022741]" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-4 px-8 overflow-y-auto">
              <ul className="space-y-4">
                <li>
                  <p className="font-bold text-[#022741] text-lg">Who We Are?</p>
                  <ul className="pl-4 border-l-2 border-gray-100 ml-1">
                    <li><Link href="/overview" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Overview</Link></li>
                    <li><Link href="/missionview" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Vision & Mission</Link></li>
                    <li><Link href="/our-team" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Our Team</Link></li>
                    <li><Link href="/volunteers" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Our Volunteers</Link></li>
                    <li><Link href="/certificate" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Certificate</Link></li>
                  </ul>
                </li>

                <li>
                  <p className="font-bold text-[#022741] text-lg">What We Do?</p>
                  <ul className="pl-4 border-l-2 border-gray-100 ml-1">
                    <li><Link href="/agriculture" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Agriculture</Link></li>
                    <li><Link href="/education" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Education</Link></li>
                    <li><Link href="/healthcare" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Healthcare</Link></li>
                    <li><Link href="/women-empowerment" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Women Empowerment</Link></li>
                  </ul>
                </li>

                <li>
                  <p className="font-bold text-[#022741] text-lg">News & Stories</p>
                  <ul className="pl-4 border-l-2 border-gray-100 ml-1">
                    <li><Link href="/photo-gallery" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Photo Gallery</Link></li>
                    <li><Link href="/video-gallery" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Video Gallery</Link></li>
                    <li><Link href="/resources" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Resources</Link></li>
                  </ul>
                </li>

                <li>
                  <p className="font-bold text-[#022741] text-lg">Get Involved</p>
                  <ul className="pl-4 border-l-2 border-gray-100 ml-1">
                    <li><Link href="/work-with-us" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Work With Us</Link></li>
                    <li><Link href="/apply-volunteer" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Apply Volunteer</Link></li>
                    <li><Link href="/corporate-partnership" onClick={onClose} className="text-gray-600 hover:text-blue-600 block py-1">Corporate Partnership</Link></li>
                  </ul>
                </li>

                <li>
                  <Link href="/blog" onClick={onClose} className="block text-[#022741] font-bold text-lg">
                    Blog
                  </Link>
                </li>

                <li>
                  <Link href="/reach-us" onClick={onClose} className="block text-[#022741] font-bold text-lg">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              <Link
                href="/apply-volunteer"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#022741] text-[#022741] py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
                <span>Apply as Volunteer</span>
              </Link>

              <div className="w-full" onClick={onClose}>
                <DonateButton size="large" className="w-full justify-center" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}