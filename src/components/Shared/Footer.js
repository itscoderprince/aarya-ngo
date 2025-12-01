"use client"

import Link from "next/link"
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart
} from "lucide-react"

export default function Footer() {
  // Color Constants
  const navyColor = '#022741'
  const yellowColor = '#FFB70B'

  const quickLinks = [
    { label: "About Us", href: "/overview" },
    { label: "Our Mission", href: "/missionview" },
    { label: "Our Team", href: "/our-team" },
    { label: "Media Gallery", href: "/photo-gallery" },
    { label: "Blogs", href: "/blog" },
  ]

  const actionLinks = [
    { label: "Donate Now", href: "/donate" },
    { label: "Become a Volunteer", href: "/apply-volunteer" },
    { label: "Corporate Partnership", href: "/corporate-partnership" },
    { label: "Work with Us", href: "/work-with-us" },
    { label: "Contact Support", href: "/reach-us" },
  ]

  return (
    <footer className="text-white relative overflow-hidden" style={{ backgroundColor: navyColor }}>

      {/* Decorative Top Border */}
      <div className="h-1 w-full" style={{ backgroundColor: yellowColor }}></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* 1. ORGANIZATION INFO */}
          <div className="space-y-6 col-span-2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg"
                style={{ backgroundColor: yellowColor, color: navyColor }}
              >
                P
              </div>
              <div className="leading-tight">
                <h2 className="font-bold text-lg tracking-wide">PRAYAS</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">By Aarya Foundation</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Prayas by Aarya Foundation is registered under Section 8 of the Companies Act, 2013. We work tirelessly at the grassroots level to implement sustainable development goals. From rural education and women empowerment to emergency healthcare, our initiatives are designed to foster long-term growth and social equity.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFB70B] hover:text-[#022741] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h3 className="font-bold text-lg mb-6 border-b-2 inline-block pb-1" style={{ borderColor: yellowColor }}>
              Discover
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#FFB70B] text-sm flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. GET INVOLVED */}
          <div>
            <h3 className="font-bold text-lg mb-6 border-b-2 inline-block pb-1" style={{ borderColor: yellowColor }}>
              Get Involved
            </h3>
            <ul className="space-y-3">
              {actionLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#FFB70B] text-sm flex items-center gap-2 transition-colors group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. CONTACT INFO */}
          <div>
            <h3 className="font-bold text-lg mb-6 border-b-2 inline-block pb-1" style={{ borderColor: yellowColor }}>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: yellowColor }} />
                <span>
                  Saraswati Vidya Nivas, Koramtoli,<br />
                  Behind Dr S N Yadav, Morabadi,<br />
                  Ranchi, Jharkhand 834001
                </span>
              </div>

              <div className="flex gap-3 text-sm text-gray-400 items-center">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: yellowColor }} />
                <span>+91 62002 18724</span>
              </div>

              <div className="flex gap-3 text-sm text-gray-400 items-center">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: yellowColor }} />
                <span>prayasbyaaryafoundation@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} Prayas by Aarya Foundation. All rights reserved.</p>
            <p className="mt-1">CIN: U85499JH2017NPL024878</p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}