"use client"
import Link from "next/link"
import { useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { motion, AnimatePresence } from "framer-motion"
import DonateButton from "../DonateButton/DonateButton"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const navLinks = [
    { href: "/", label: "Home" },
    {
      // label: "About Us",
      label: "Who We Are?",
      subLinks: [
        { href: "/overview", label: "Overview" },
        { href: "/missionview", label: "Vision & Mission" },
        // { href: "/who-we-are", label: "Who We Are?" },
        // { href: "/what-we-do", label: "What We Do?" },
        // { href: "/get-involved", label: "Get Involved" },
        { href: "/our-team", label: "Our Team" },
        { href: "/certificate", label: "Certificate" },

      ],
    },
     {
      label: "What We Do?",
      subLinks: [
        { href: "/education", label: "Education" },
        { href: "/healthcare", label: "HealthCare" },
        // { href: "/community-support", label: "Community Support" },

        { href: "/women-empowerment", label: "Women Empowernment" },

       
      ],
    },

            {
      label: "News & stories",
      subLinks: [
        { href: "/photo-gallery", label: "Photo Gallery" },
        { href: "/video-gallery", label: "Video Gallery" },
        { href: "/resources", label: "Resources" },
    
      ],
    },
      {
      label: "Get Involved",
      subLinks: [

        { href: "/work-with-us", label: "Work with us" },
        { href: "/corporate-partnership", label: "Corporate partnership" },
       
      ],
    },
        { href: "/blog", label: "Blog" },

            {
      label: "Contact us",
      subLinks: [
        { href: "/reach-us", label: "Reach Us" },
        { href: "/faqs", label: "FAQs" },
       
      ],
    },
  ]

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#022741" }}
            >
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl" style={{ color: "#022741" }}>
              Prayas by Aarya Foundation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {navLinks.map((link, idx) =>
              link.subLinks ? (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(idx)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className="font-medium hover:text-opacity-80 transition-colors"
                    style={{ color: "#022741" }}
                  >
                    {link.label}
                  </button>
                  <AnimatePresence>
                    {openDropdown === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
                      >
                        {link.subLinks.map((sub, subIdx) => (
                          <Link
                            key={subIdx}
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
              ) : (
                <Link
                  key={idx}
                  href={link.href}
                  className="font-medium hover:text-opacity-80 transition-colors"
                  style={{ color: "#022741" }}
                >
                  {link.label}
                </Link>
              )
            )}
            <DonateButton size="small" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md"
              style={{ color: "#022741" }}
            >
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navLinks.map((link, idx) =>
                link.subLinks ? (
                  <div key={idx}>
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === idx ? null : idx)
                      }
                      className="w-full text-left px-3 py-2 font-medium hover:bg-gray-50 rounded-md"
                      style={{ color: "#022741" }}
                    >
                      {link.label}
                    </button>
                    <AnimatePresence>
                      {openDropdown === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-6"
                        >
                          {link.subLinks.map((sub, subIdx) => (
                            <Link
                              key={subIdx}
                              href={sub.href}
                              className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={idx}
                    href={link.href}
                    className="block px-3 py-2 text-base font-medium hover:bg-gray-50 rounded-md"
                    style={{ color: "#022741" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
