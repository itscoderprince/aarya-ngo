import Link from "next/link"
import DonateButton from "../../components/DonateButton/DonateButton"
import { Heart, Shield, Users, Award, Eye, Target, History, ArrowRight } from "lucide-react"

export const metadata = {
  title: "Who We Are - Hope Foundation | Our Story, Mission & Values",
  description:
    "Learn about Hope Foundation's journey, mission, and the dedicated team working to create positive change in communities worldwide through education, healthcare, and sustainable development.",
}

export default function WhoWeArePage() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description:
        "We approach every situation with empathy and understanding, putting people first in everything we do.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We maintain the highest ethical standards and transparency in all our operations and partnerships.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of working together with communities, partners, and stakeholders.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest quality in our programs and services to maximize our impact.",
    },
  ]

  const milestones = [
    {
      year: "2010",
      title: "Foundation Established",
      description: "Hope Foundation was founded with a mission to create lasting change in underserved communities.",
    },
    {
      year: "2015",
      title: "Global Expansion",
      description: "Extended our reach to 10 countries, impacting over 10,000 lives through various programs.",
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description: "Launched digital education platforms and remote healthcare initiatives during the pandemic.",
    },
    {
      year: "2024",
      title: "50,000 Lives Impacted",
      description: "Reached a major milestone of positively impacting 50,000+ lives across 25+ countries.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-white">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#022741_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold mb-6">
                About Us
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-[#022741] leading-tight">
                Empowering Communities, <br />
                <span className="text-[#ffb70b]">Transforming Lives</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-10">
                Hope Foundation is a global nonprofit organization dedicated to creating sustainable change.
                Since 2010, we have been working tirelessly to improve lives through education, healthcare,
                and community development programs.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-12">
                {/* Mission */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#022741] flex items-center justify-center shadow-lg">
                      <Target className="w-8 h-8 text-[#ffb70b]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#022741] mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      To empower communities worldwide by providing access to quality education, healthcare, and
                      sustainable development opportunities that create lasting positive change and break the cycle of
                      poverty.
                    </p>
                  </div>
                </div>

                {/* Vision */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[#ffb70b] flex items-center justify-center shadow-lg">
                      <Eye className="w-8 h-8 text-[#022741]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#022741] mb-4">Our Vision</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      A world where every person has the opportunity to reach their full potential, regardless of their
                      circumstances, and where communities are empowered to create their own sustainable solutions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-[#ffb70b]/20 rounded-3xl transform rotate-3"></div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/mission-vision-community.png"
                    alt="Community members working together"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 bg-[#022741] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold text-white mb-6">Our Core Values</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                These fundamental principles guide every decision we make and every action we take.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={index}
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#ffb70b] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-[#022741]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Journey / Timeline */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center p-3 bg-white rounded-xl shadow-sm mb-6">
                <History className="w-6 h-6 text-[#ffb70b] mr-2" />
                <span className="font-bold text-[#022741]">Our History</span>
              </div>
              <h2 className="text-4xl font-bold text-[#022741] mb-6">Our Journey of Impact</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                From humble beginnings to global impact, marking our key milestones.
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              {/* Vertical Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden md:block"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}>
                    {/* Content Side */}
                    <div className="flex-1 w-full md:w-1/2">
                      <div className={`bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                        }`}>
                        <span className="inline-block px-3 py-1 rounded-full bg-[#022741]/5 text-[#022741] font-bold text-sm mb-3">
                          {milestone.year}
                        </span>
                        <h3 className="text-xl font-bold text-[#022741] mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Center Dot */}
                    <div className="relative flex-shrink-0 z-10">
                      <div className="w-12 h-12 rounded-full bg-[#ffb70b] border-4 border-white shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#022741]"></div>
                      </div>
                    </div>

                    {/* Empty Side for Balance */}
                    <div className="flex-1 w-full md:w-1/2 hidden md:block"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#022741] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join us in our mission to create lasting positive change. Whether you donate, volunteer, or partner with us, your support matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <DonateButton size="large" />
              <Link
                href="/work-with-us"
                className="group flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-200"
              >
                Work With Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
