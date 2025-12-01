"use client"

import Link from "next/link"
import DonateButton from "../DonateButton/DonateButton"

// Icons
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import HandshakeIcon from "@mui/icons-material/Handshake"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

export default function HomePageCTA() {
  // Color Constants
  const navyColor = '#022741'
  const yellowColor = '#FFB70B'

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#022741 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 mb-4 bg-white border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm" style={{ color: navyColor }}>
            Take Action
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: navyColor }}>
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of supporters who are helping us create positive change. Every contribution, big or small, makes a real impact.
          </p>
        </div>

        {/* CTA Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* 1. Donate Card */}
          <div
            className="group bg-white p-8 rounded-2xl shadow-xl border-t-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center"
            style={{ borderColor: yellowColor }}
          >
            {/* Icon Wrapper */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: navyColor }}
            >
              <VolunteerActivismIcon style={{ fontSize: 40, color: yellowColor }} />
            </div>

            <h3 className="text-2xl font-bold mb-3" style={{ color: navyColor }}>
              Make a Donation
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your financial support helps us expand our education and healthcare programs to reach more communities in need immediately.
            </p>

            <div className="mt-auto">
              <DonateButton size="large" />
            </div>
          </div>

          {/* 2. Volunteer Card */}
          <div
            className="group bg-white p-8 rounded-2xl shadow-xl border-t-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col items-center text-center"
            style={{ borderColor: yellowColor }}
          >
            {/* Icon Wrapper */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: navyColor }}
            >
              <HandshakeIcon style={{ fontSize: 40, color: yellowColor }} />
            </div>

            <h3 className="text-2xl font-bold mb-3" style={{ color: navyColor }}>
              Become a Volunteer
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Share your time, skills, and passion. Work directly with us on the ground to build stronger, self-reliant communities.
            </p>

            <div className="mt-auto">
              <Link
                href="/apply-volunteer"
                // Changes: Added text-[#022741] and border-[#022741] here, removed style prop
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg border-2 transition-all duration-300 text-[#022741] border-[#022741] hover:bg-[#022741] hover:text-white"
              >
                Join the Team
                <ArrowForwardIcon style={{ fontSize: 20 }} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}