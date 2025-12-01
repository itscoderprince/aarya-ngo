"use client"

import Link from "next/link"
import DonateButton from "../DonateButton/DonateButton"
import { Users, Globe, HeartHandshake, ArrowRight } from "lucide-react"

export default function HomePageHero() {
  // Color Constants
  const navyColor = '#022741'
  const yellowColor = '#FFB70B'

  return (
    <section className="relative w-full bg-white overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">

      {/* Background Decorative Blob (Subtle) */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT: TEXT CONTENT */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FFB70B] animate-pulse"></span>
              Non-Profit Organization
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight" style={{ color: navyColor }}>
              Creating Hope, <br />
              <span className="relative inline-block">
                <span className="relative z-10">Changing Lives.</span>
                {/* Yellow Underline Decor */}
                <svg className="absolute bottom-1 left-0 w-full h-3 -z-0 text-[#FFB70B]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.4" />
                </svg>
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 pr-4">
              Join us in our mission to build stronger communities through education, healthcare, and sustainable development. Together, we can make a lasting impact.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <DonateButton size="large" />

              <Link
                href="/about-us"
                className="group flex items-center justify-center gap-2 px-8 py-4 text-[#022741] font-bold rounded-full border-2 border-[#022741] hover:bg-[#022741] hover:text-white transition-all duration-300"
              >
                Learn More
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-6 h-6 text-[#FFB70B]" />
                  <span className="text-3xl font-bold" style={{ color: navyColor }}>50K+</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Lives Impacted</p>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-6 h-6 text-[#FFB70B]" />
                  <span className="text-3xl font-bold" style={{ color: navyColor }}>25+</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Countries Reach</p>
              </div>
              <div className="border-l border-gray-100 pl-6">
                <div className="flex items-center gap-2 mb-1">
                  <HeartHandshake className="w-6 h-6 text-[#FFB70B]" />
                  <span className="text-3xl font-bold" style={{ color: navyColor }}>100+</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">Active Projects</p>
              </div>
            </div>
          </div>

          {/* RIGHT: IMAGE COMPOSITION */}
          <div className="relative lg:h-auto flex items-center justify-center lg:justify-end">

            {/* Decorative Yellow Frame Offset */}
            <div className="absolute top-4 right-4 w-[90%] h-[90%] rounded-[2rem] border-4 border-[#FFB70B] -z-0"></div>

            {/* Main Image */}
            <div className="relative w-[90%] aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src="/volunteers-children-community.png"
                alt="Hope Foundation volunteers helping communities"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#022741]/60 via-transparent to-transparent"></div>

              {/* Floating Card inside Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-[#FFB70B]">
                <p className="text-[#022741] font-bold text-lg italic">
                  "The smallest act of kindness is worth more than the grandest intention."
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-0.5 bg-gray-300"></div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Aarya Foundation</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}