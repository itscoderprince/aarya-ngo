"use client"

import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import PeopleIcon from "@mui/icons-material/People"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import LocationOnIcon from "@mui/icons-material/LocationOn"

export default function HomePageImpact() {
  const stats = [
    {
      icon: PeopleIcon,
      number: "50+",
      label: "Lives Changed",
      description: "People directly impacted by our programs",
    },
    {
      icon: PeopleIcon,
      number: "250000",
      label: "Funds Raised",
      description: "Total donations received this year",
    },
    {
      icon: LocationOnIcon,
      number: "25+",
      label: "Countries",
      description: "Global reach across continents",
    },
    {
      icon: TrendingUpIcon,
      number: "95%",
      label: "Success Rate",
      description: "Projects completed successfully",
    },
  ]

  return (
    <section className="py-20" style={{ backgroundColor: "#011728" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Our Impact in Numbers</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See the tangible difference we are making in communities worldwide through our dedicated efforts and your
            generous support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#ffb70b" }}
                >
                  <IconComponent className="w-8 h-8" style={{ color: "#022741" }} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-xl font-semibold mb-2" style={{ color: "#ffb70b" }}>
                  {stat.label}
                </div>
                <p className="text-gray-300">{stat.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
