import Navbar from "../../components/Shared/Navbar"
import Footer from "../../components/Shared/Footer"

import EducationHero from "@/components/Education/EducationHero"
import EducationPrograms from "@/components/Education/EducationPrograms"
import EducationImpact from "@/components/Education/EducationImpact"
import EducationCTA from "@/components/Education/EducationCTA"

export default function EducationPage() {
  return (
    <div className="">
  

      {/* Page Content */}
      <main className="flex-grow">
        <EducationHero />
        <EducationPrograms />
        <EducationImpact />
        <EducationCTA />
      </main>

    </div>
  )
}

