"use client"

import Link from "next/link"
import { Construction, ArrowLeft, Users } from "lucide-react"

// Color constants
const COLORS = {
    navy: 'rgb(2, 39, 65)',
    yellow: 'rgb(255, 183, 11)',
}

export default function OurTeamPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">

            {/* Icon Container */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                <div className="relative bg-white p-6 rounded-full shadow-xl border border-gray-100">
                    <Construction className="w-16 h-16" style={{ color: COLORS.navy }} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FFB70B] p-2 rounded-full border-4 border-white shadow-sm">
                    <Users className="w-6 h-6 text-[#022741]" />
                </div>
            </div>

            {/* Text Content */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.navy }}>
                We're Building Our Team
            </h1>

            <p className="text-gray-600 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
                This page is currently under construction. We are gathering the amazing profiles of our dedicated team members. Check back soon!
            </p>

            {/* Action Button */}
            <Link
                href="/"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-900/10 transition-all hover:shadow-blue-900/20 hover:-translate-y-0.5"
                style={{ backgroundColor: COLORS.navy }}
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
            </Link>

        </div>
    )
}
