import DonateButton from "../../components/DonateButton/DonateButton"
import GroupsIcon from "@mui/icons-material/Groups"
import VisibilityIcon from "@mui/icons-material/Visibility"
import FavoriteIcon from "@mui/icons-material/Favorite"
import HandshakeIcon from "@mui/icons-material/Handshake"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

export const metadata = {
  title: "Who We Are - Hope Foundation | Our Story, Mission & Values",
  description:
    "Learn about Hope Foundation's journey, mission, and the dedicated team working to create positive change in communities worldwide through education, healthcare, and sustainable development.",
}

export default function WhoWeArePage() {
  const values = [
    {
      icon: FavoriteIcon,
      title: "Compassion",
      description:
        "We approach every situation with empathy and understanding, putting people first in everything we do.",
    },
    {
      icon: HandshakeIcon,
      title: "Integrity",
      description: "We maintain the highest ethical standards and transparency in all our operations and partnerships.",
    },
    {
      icon: GroupsIcon,
      title: "Collaboration",
      description: "We believe in the power of working together with communities, partners, and stakeholders.",
    },
    {
      icon: EmojiEventsIcon,
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

  const leadership = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      description: "20+ years of experience in international development and nonprofit leadership.",
    },
    {
      name: "Dr. Michael Chen",
      role: "Program Director",
      description: "Former WHO consultant specializing in global health and community development.",
    },
    {
      name: "Maria Rodriguez",
      role: "Operations Manager",
      description: "Expert in nonprofit operations and sustainable program implementation.",
    },
    {
      name: "James Thompson",
      role: "Finance Director",
      description: "CPA with extensive experience in nonprofit financial management and transparency.",
    },
  ]

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold mb-6" style={{ color: "#022741" }}>
                Who We Are
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Hope Foundation is a global nonprofit organization dedicated to creating sustainable change in
                communities worldwide. Since 2010, we have been working tirelessly to improve lives through education,
                healthcare, and community development programs.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: "#ffb70b" }}
                    >
                      <FavoriteIcon className="w-6 h-6" style={{ color: "#022741" }} />
                    </div>
                    <h2 className="text-3xl font-bold" style={{ color: "#022741" }}>
                      Our Mission
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To empower communities worldwide by providing access to quality education, healthcare, and
                    sustainable development opportunities that create lasting positive change and break the cycle of
                    poverty.
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: "#ffb70b" }}
                    >
                      <VisibilityIcon className="w-6 h-6" style={{ color: "#022741" }} />
                    </div>
                    <h2 className="text-3xl font-bold" style={{ color: "#022741" }}>
                      Our Vision
                    </h2>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    A world where every person has the opportunity to reach their full potential, regardless of their
                    circumstances, and where communities are empowered to create their own sustainable solutions.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/mission-vision-community.png"
                    alt="Community members working together on development projects"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20" style={{ backgroundColor: "#011728" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                These fundamental principles guide every decision we make and every action we take in our mission to
                create positive change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: "#ffb70b" }}
                    >
                      <IconComponent className="w-8 h-8" style={{ color: "#022741" }} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#022741" }}>
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From humble beginnings to global impact, here are the key milestones in our organization s growth and
                development.
              </p>
            </div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                      style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                    >
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: "#022741" }}>
                      {milestone.title}
                    </h3>
                    <p className="text-lg text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership */}
        {/* <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#022741" }}>
                Our Leadership Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the dedicated professionals who guide our organization and ensure we deliver maximum impact in
                everything we do.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((leader, index) => (
                <div key={index} className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden shadow-lg bg-gray-200">
                    <img
                      src={`/team-member-${index + 1}.png`}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: "#022741" }}>
                    {leader.name}
                  </h3>
                  <p className="font-semibold mb-3" style={{ color: "#ffb70b" }}>
                    {leader.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">{leader.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* CTA */}
        <section className="py-20" style={{ backgroundColor: "#022741" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to be part of something bigger? Help us continue creating positive change in communities worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DonateButton size="large" />
              <button
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white transition-all duration-200"
                style={{ color: "#ffffff" }}
              >
                Learn About Our Programs
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
