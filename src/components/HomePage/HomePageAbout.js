"use client"

import { GraduationCap, Stethoscope, Leaf, Home, ArrowRight } from "lucide-react"

export default function HomePageAbout() {
  const features = [
    {
      icon: GraduationCap,
      title: "Education",
      description: "Providing quality education and learning opportunities to underserved communities worldwide.",
    },
    {
      icon: Stethoscope,
      title: "Healthcare",
      description: "Delivering essential healthcare services and medical support to those who need it most.",
    },
    {
      icon: Leaf,
      title: "Environment",
      description: "Promoting sustainable practices and environmental conservation for future generations.",
    },
    {
      icon: Home,
      title: "Housing",
      description: "Building safe, affordable housing solutions for families in need of stable homes.",
    },
  ]

  // Color Constants
  const navyColor = '#022741'
  // const yellowColor = '#FFB70B' // Used in Tailwind classes

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 mb-3 bg-blue-50 text-[#022741] rounded-full text-[10px] font-bold uppercase tracking-wider">
            What We Do
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: navyColor }}>
            Our Mission Areas
          </h2>
          <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We focus on four key pillars to create sustainable change and improve lives in communities around the world.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 transition-all duration-300 border border-gray-200 hover:border-[#022741] hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                {/* Icon Container 
                    Fixed: Removed inline style, used Tailwind `bg-[#022741]/5` and `group-hover:bg-[#FFB70B]` 
                */}
                <div
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-5 transition-colors duration-300 bg-[#022741]/5 text-[#022741] group-hover:bg-[#FFB70B]"
                >
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-bold mb-2 transition-colors duration-300 group-hover:text-[#022741]" style={{ color: navyColor }}>
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Read More Link (Visible on Hover) */}
                <div className="flex items-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0" style={{ color: navyColor }}>
                  Learn More <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}