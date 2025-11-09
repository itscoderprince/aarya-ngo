
import DonateButton from "../../components/DonateButton/DonateButton"
import SchoolIcon from "@mui/icons-material/School"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import NatureIcon from "@mui/icons-material/Nature" // replaced EcoIcon with NatureIcon
import HomeIcon from "@mui/icons-material/Home"
import WaterDropIcon from "@mui/icons-material/WaterDrop"
import AgricultureIcon from "@mui/icons-material/Agriculture"
import GroupsIcon from "@mui/icons-material/Groups"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"

export const metadata = {
  title: "What We Do - Hope Foundation | Our Programs & Impact",
  description:
    "Discover Hope Foundation's comprehensive programs in education, healthcare, environmental sustainability, and community development. Learn how we create lasting change worldwide.",
}

export default function WhatWeDoPage() {
  const programs = [
    {
      icon: SchoolIcon,
      title: "Education Programs",
      description:
        "Building schools, training teachers, and providing educational resources to underserved communities.",
      impact: "25,000+ students educated",
      projects: [
        "Mobile Learning Centers",
        "Teacher Training Programs",
        "Digital Literacy Initiatives",
        "Scholarship Programs",
      ],
    },
    {
      icon: LocalHospitalIcon,
      title: "Healthcare Services",
      description: "Delivering essential medical care and health education to improve community wellness.",
      impact: "15,000+ patients treated",
      projects: [
        "Mobile Health Clinics",
        "Maternal Health Programs",
        "Vaccination Campaigns",
        "Health Worker Training",
      ],
    },
    {
      icon: NatureIcon, // replaced EcoIcon with NatureIcon
      title: "Environmental Sustainability",
      description: "Promoting eco-friendly practices and environmental conservation for future generations.",
      impact: "500+ trees planted",
      projects: [
        "Reforestation Projects",
        "Clean Energy Solutions",
        "Waste Management Systems",
        "Environmental Education",
      ],
    },
    {
      icon: HomeIcon,
      title: "Housing & Infrastructure",
      description: "Building safe, affordable housing and essential infrastructure for communities in need.",
      impact: "200+ homes built",
      projects: [
        "Affordable Housing Construction",
        "Water System Installation",
        "Community Centers",
        "Road Development",
      ],
    },
    {
      icon: WaterDropIcon,
      title: "Clean Water Access",
      description: "Providing clean, safe drinking water and sanitation facilities to rural communities.",
      impact: "10,000+ people with clean water",
      projects: ["Well Drilling Projects", "Water Purification Systems", "Sanitation Facilities", "Hygiene Education"],
    },
    {
      icon: AgricultureIcon,
      title: "Agricultural Development",
      description: "Supporting farmers with training, tools, and sustainable farming techniques.",
      impact: "1,000+ farmers trained",
      projects: [
        "Sustainable Farming Training",
        "Seed Distribution Programs",
        "Irrigation Systems",
        "Market Access Support",
      ],
    },
  ]

  const approach = [
    {
      icon: GroupsIcon,
      title: "Community-Centered",
      description: "We work directly with communities to understand their needs and develop solutions together.",
    },
    {
      icon: VolunteerActivismIcon,
      title: "Sustainable Impact",
      description: "Our programs are designed to create lasting change that communities can maintain independently.",
    },
    {
      icon: SchoolIcon,
      title: "Evidence-Based",
      description: "We use data and research to guide our decisions and measure our impact effectively.",
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
                What We Do
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Hope Foundation implements comprehensive programs across six key areas to create sustainable change in
                communities worldwide. Our holistic approach addresses immediate needs while building long-term capacity
                for self-sufficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Programs Overview */}
        <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#022741" }}>
                Our Program Areas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each program is carefully designed to address specific community needs while contributing to overall
                development and empowerment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => {
                const IconComponent = program.icon
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ backgroundColor: "#ffb70b" }}
                    >
                      <IconComponent className="w-8 h-8" style={{ color: "#022741" }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: "#022741" }}>
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>
                    <div className="mb-4">
                      <span className="text-lg font-semibold" style={{ color: "#ffb70b" }}>
                        {program.impact}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {program.projects.map((project, projectIndex) => (
                        <li key={projectIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: "#ffb70b" }}></div>
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-20" style={{ backgroundColor: "#011728" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Our Approach</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We believe in working with communities, not just for them. Our methodology ensures sustainable,
                long-lasting impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {approach.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <div key={index} className="text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: "#ffb70b" }}
                    >
                      <IconComponent className="w-10 h-10" style={{ color: "#022741" }} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Impact Stories */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4" style={{ color: "#022741" }}>
                Stories of Impact
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real stories from the communities we serve, showcasing the transformative power of our programs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/impact-story-education.png"
                    alt="Students in a classroom built by Hope Foundation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#022741" }}>
                    Transforming Education in Rural Kenya
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    In partnership with the local community, we built a new school that now serves 300 children. The
                    school includes modern classrooms, a library, and computer lab, providing quality education that was
                    previously unavailable in this remote area.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/impact-story-healthcare.png"
                    alt="Mobile health clinic serving rural community"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3" style={{ color: "#022741" }}>
                    Bringing Healthcare to Remote Villages
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our mobile health clinics have revolutionized healthcare access in remote areas of Guatemala. We have
                    treated over 5,000 patients and trained 50 community health workers, creating a sustainable
                    healthcare network.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ backgroundColor: "#022741" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Support Our Programs</h2>
            <p className="text-xl text-gray-300 mb-8">
              Your contribution directly funds these life-changing programs. Join us in creating sustainable impact
              worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DonateButton size="large" />
              <button
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white text-white hover:bg-white transition-all duration-200"
                style={{ color: "#ffffff" }}
              >
                Get Involved
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
