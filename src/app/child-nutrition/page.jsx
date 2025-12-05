"use client";

import { useState } from "react";
import {
    Heart,
    Utensils,
    Apple,
    TrendingUp,
    Users,
    ArrowRight,
    Baby,
    Smile
} from "lucide-react";
import Link from "next/link";
// Replaced Next.js Link with standard anchor tag for preview compatibility
// import Link from "next/link"; 

// --- Constants & Config ---
const COLORS = {
    navy: "#022741",
    yellow: "#FFB70B",
    lightBlue: "#F0F4F8",
    white: "#FFFFFF",
};

// Statistics Data
const stats = [
    { id: 1, value: "1500+", label: "Children Fed Daily", icon: Utensils },
    { id: 2, value: "15", label: "Partner Schools", icon: Users },
    { id: 3, value: "20k", label: "Meals Served", icon: Apple },
    { id: 4, value: "85%", label: "Health Improvement", icon: TrendingUp },
];

export default function ChildNutritionPage() {
    const [activeTab, setActiveTab] = useState("meals");

    return (
        <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.lightBlue }}>

            {/* 1. HERO SECTION */}
            <div className="relative h-[500px] w-full overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop"
                        alt="Happy Indian children eating"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#022741]/80 mix-blend-multiply"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-[#FFB70B] text-[#022741] text-xs font-bold uppercase tracking-wider w-fit mb-4">
                        Mission: Poshan (Nutrition)
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Nourishing Dreams, <br />
                        <span className="text-[#FFB70B]">One Meal at a Time.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-8 leading-relaxed">
                        Malnutrition is the biggest barrier to education in rural India. We ensure that no child has to choose between hunger and homework.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/donate-now"
                            className="px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg flex items-center gap-2"
                            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
                        >
                            Donate a Meal <Heart className="w-5 h-5 fill-current" />
                        </a>
                        <Link href="/photo-gallery" className="px-8 py-4 rounded-full font-bold text-lg border-2 border-white text-white hover:bg-white hover:text-[#022741] transition-all">
                            View Gallery
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. THE CHALLENGE & STATS */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                className="bg-white p-6 rounded-xl shadow-xl border-b-4 hover:-translate-y-2 transition-transform duration-300"
                                style={{ borderColor: COLORS.yellow }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 rounded-lg bg-[#F0F4F8]">
                                        <stat.icon className="w-8 h-8 text-[#022741]" />
                                    </div>
                                    <span className="text-4xl font-bold text-[#022741]">{stat.value}</span>
                                </div>
                                <h3 className="text-gray-500 font-medium uppercase tracking-wide text-sm">{stat.label}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. OUR APPROACH (Tabs) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.navy }}>
                            Our Nutrition Program
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We take a holistic approach to child health, focusing not just on filling stomachs, but on providing the right nutrients for growth and immunity.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Left: Tab Buttons */}
                        <div className="w-full md:w-1/3 flex flex-col gap-2">
                            {[
                                { id: 'meals', label: 'Mid-Day Meals', icon: Utensils },
                                { id: 'supplements', label: 'Nutritional Supplements', icon: Apple },
                                { id: 'health', label: 'Health Camps', icon: TrendingUp },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`p-4 rounded-lg text-left flex items-center gap-4 transition-all duration-300 border-l-4
                    ${activeTab === tab.id
                                            ? 'bg-[#F0F4F8] border-[#FFB70B] shadow-sm'
                                            : 'bg-white border-transparent hover:bg-gray-50'}`}
                                >
                                    <div className={`p-2 rounded-full ${activeTab === tab.id ? 'bg-[#022741] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <tab.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold ${activeTab === tab.id ? 'text-[#022741]' : 'text-gray-500'}`}>{tab.label}</h4>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Right: Tab Content */}
                        <div className="w-full md:w-2/3 bg-[#F0F4F8] p-8 rounded-2xl border border-gray-100 min-h-[300px]">
                            {activeTab === 'meals' && (
                                <div className="animate-fadeIn">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.navy }}>Hot, Fresh Mid-Day Meals</h3>
                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                Every school day, our central kitchen prepares fresh, hygienic meals including rice, dal, vegetables, and roti. For many children, this is the only nutritious meal they receive all day.
                                            </p>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3 text-gray-700">
                                                    <Smile className="w-5 h-5 text-green-500" /> 100% Hygiene Compliant
                                                </li>
                                                <li className="flex items-center gap-3 text-gray-700">
                                                    <Smile className="w-5 h-5 text-green-500" /> Locally Sourced Vegetables
                                                </li>
                                                <li className="flex items-center gap-3 text-gray-700">
                                                    <Smile className="w-5 h-5 text-green-500" /> Menu changes weekly
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="w-full md:w-1/2 h-64 rounded-xl overflow-hidden shadow-md">
                                            <img src="https://images.unsplash.com/photo-1606914502596-f6f897621c84?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Mid day meal" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'supplements' && (
                                <div className="animate-fadeIn">
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.navy }}>Iron & Vitamin Supplements</h3>
                                    <p className="text-gray-600 mb-4">
                                        To combat anemia and deficiencies, we provide weekly supplements to children, especially adolescent girls.
                                    </p>
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-[#FFB70B]">
                                        <p className="italic text-gray-600">"Since the program started, attendance has gone up by 20% because children fall sick less often." - Principal, Govt School, Rampur.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'health' && (
                                <div className="animate-fadeIn">
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: COLORS.navy }}>Quarterly Health Checkups</h3>
                                    <p className="text-gray-600 mb-4">
                                        Doctors visit our partner schools every 3 months to monitor BMI, height, and weight to ensure our nutrition program is working effectively.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. DONATION CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 text-center" style={{ backgroundColor: COLORS.navy }}>
                <div className="max-w-4xl mx-auto">
                    <Baby className="w-16 h-16 text-[#FFB70B] mx-auto mb-6" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        It costs just <span className="text-[#FFB70B]">₹2100</span> to feed a child for an entire year.
                    </h2>
                    <p className="text-blue-200 text-lg mb-10 max-w-2xl mx-auto">
                        Your small contribution can build a healthy foundation for a child's future. All donations are 100% tax exempted under section 80G.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/donate-now"
                            className="px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                            style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
                        >
                            Donate ₹2100 Now <ArrowRight className="w-5 h-5" />
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-bold text-lg border border-gray-600 text-white hover:bg-white/10 transition-colors"
                        >
                            Sponsor a School
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}