"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Linkedin, Mail, Twitter } from "lucide-react"

// Color constants
const COLORS = {
    navy: '#022741',
    yellow: '#FFB70B',
    lightBlue: '#F0F4F8',
}

const teamMembers = [
    {
        name: "Pappu Kumar",
        role: "LLM, MBA, M.com",
        image: "/teamImg/Pappu kumar.jpeg",
        bio: "Dedicated to driving social change through legal and financial expertise.",
        social: {
            linkedin: "#",
            twitter: "#",
            email: "mailto:contact@prayas.org"
        }
    },
    {
        name: "Gudiya Kumari",
        role: "M.Sc",
        image: "/teamImg/Gudiya kumari.jpeg",
        bio: "Passionate about education and scientific advancement for community development.",
        social: {
            linkedin: "#",
            twitter: "#",
            email: "mailto:contact@prayas.org"
        }
    }
]

export default function OurTeamPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative z-10 max-w-3xl mt-6 mx-auto">
                <h1 className="text-4xl md:text-5xl text-center font-bold mb-1" style={{ color: COLORS.navy }}>
                    Our Team Members
                </h1>
                <p className="text-lg text-gray-500 text-center max-w-4xl mx-auto">
                    Meet the dedicated individuals working tirelessly to make a difference in our community.
                </p>
            </div>

            {/* Team Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 group"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="flex gap-4">
                                        <a href={member.social.linkedin} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-[#FFB70B] hover:text-[#022741] transition-colors">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                        <a href={member.social.twitter} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-[#FFB70B] hover:text-[#022741] transition-colors">
                                            <Twitter className="w-5 h-5" />
                                        </a>
                                        <a href={member.social.email} className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-[#FFB70B] hover:text-[#022741] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold mb-1" style={{ color: COLORS.navy }}>{member.name}</h3>
                                <p className="font-medium mb-3" style={{ color: COLORS.yellow }}>{member.role}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Back Button */}
                <div className="text-center mt-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor: COLORS.navy }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
