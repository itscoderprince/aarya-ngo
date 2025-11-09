"use client"

import DonateButton from "../../components/DonateButton/DonateButton"
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism"
import GroupsIcon from "@mui/icons-material/Groups"
import HandshakeIcon from "@mui/icons-material/Handshake"
import CampaignIcon from "@mui/icons-material/Campaign"
import BusinessIcon from "@mui/icons-material/Business"
import EventIcon from "@mui/icons-material/Event"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"

export default function GetInvolvedClientPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <GroupsIcon className="w-16 h-16 mx-auto mb-6" style={{ color: "#ffb70b" }} />
              <h1 className="text-5xl font-bold mb-6" style={{ color: "#022741" }}>
                Get Involved
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join our community of changemakers and help us create lasting impact. There are many ways to support our
                mission and make a difference in the lives of those we serve.
              </p>
            </div>
          </div>
        </section>

        {/* Ways to Get Involved */}
        <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" style={{ color: "#022741" }}>
                Ways to Make a Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose how you had like to contribute to our mission of creating positive change in communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Volunteer */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#ffb70b" }}
                >
                  <VolunteerActivismIcon className="w-8 h-8" style={{ color: "#022741" }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: "#022741" }}>
                  Volunteer
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Join our team of dedicated volunteers and directly impact communities through hands-on service and
                  support.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Teaching and tutoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Healthcare assistance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Community outreach</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Event organization</span>
                  </li>
                </ul>
                <button
                  className="w-full py-3 px-6 rounded-lg font-semibold transition-colors border-2"
                  style={{
                    borderColor: "#ffb70b",
                    color: "#022741",
                    backgroundColor: "transparent",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#ffb70b"
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent"
                  }}
                >
                  Become a Volunteer
                </button>
              </div>

              {/* Donate */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#ffb70b" }}
                >
                  <CampaignIcon className="w-8 h-8" style={{ color: "#022741" }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: "#022741" }}>
                  Donate
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Your financial support helps us expand our programs and reach more communities in need of assistance.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">One-time donations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Monthly giving</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Corporate sponsorship</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Legacy giving</span>
                  </li>
                </ul>
                <DonateButton size="medium" className="w-full justify-center" />
              </div>

              {/* Partner */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#ffb70b" }}
                >
                  <HandshakeIcon className="w-8 h-8" style={{ color: "#022741" }} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: "#022741" }}>
                  Partner
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  Collaborate with us as an organization, business, or institution to amplify our collective impact.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Corporate partnerships</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">NGO collaborations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Government initiatives</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffb70b" }}></div>
                    <span className="text-gray-600">Academic partnerships</span>
                  </li>
                </ul>
                <button
                  className="w-full py-3 px-6 rounded-lg font-semibold transition-colors border-2"
                  style={{
                    borderColor: "#ffb70b",
                    color: "#022741",
                    backgroundColor: "transparent",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#ffb70b"
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent"
                  }}
                >
                  Explore Partnerships
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section className="py-20" style={{ backgroundColor: "#fefefe" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" style={{ color: "#022741" }}>
                Current Volunteer Opportunities
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join our active volunteer programs and make an immediate impact in your community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <EventIcon className="w-8 h-8" style={{ color: "#ffb70b" }} />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: "#022741" }}>
                      Weekend Education Program
                    </h3>
                    <p className="text-gray-600">Saturdays & Sundays, 10 AM - 2 PM</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Help teach basic literacy and numeracy skills to children in underserved communities. No teaching
                  experience required - we provide training and materials.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "#ffb70b" }}>
                    Commitment: 4 hours/week
                  </span>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <BusinessIcon className="w-8 h-8" style={{ color: "#ffb70b" }} />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: "#022741" }}>
                      Skills-Based Volunteering
                    </h3>
                    <p className="text-gray-600">Flexible schedule</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  Use your professional skills in marketing, design, IT, finance, or other areas to support our
                  operations and programs remotely or on-site.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "#ffb70b" }}>
                    Commitment: 2-5 hours/week
                  </span>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6" style={{ color: "#022741" }}>
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600">
                Contact us to learn more about how you can get involved and make a difference.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: "#022741" }}>
                    Get in Touch
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <EmailIcon className="w-6 h-6" style={{ color: "#ffb70b" }} />
                      <div>
                        <p className="font-semibold" style={{ color: "#022741" }}>
                          Email
                        </p>
                        <p className="text-gray-600">prayasbyaaryafoundation@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <PhoneIcon className="w-6 h-6" style={{ color: "#ffb70b" }} />
                      <div>
                        <p className="font-semibold" style={{ color: "#022741" }}>
                          Phone
                        </p>
                        <p className="text-gray-600">+91 6200218724</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: "#022741" }}>
                    Send us a Message
                  </h3>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none"
                    />
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none">
                      <option>I am interested in...</option>
                      <option>Volunteering</option>
                      <option>Donating</option>
                      <option>Partnerships</option>
                      <option>General Information</option>
                    </select>
                    <textarea
                      placeholder="Your Message"
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-lg font-semibold transition-colors"
                      style={{ backgroundColor: "#ffb70b", color: "#022741" }}
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  
    </div>
  )
}
