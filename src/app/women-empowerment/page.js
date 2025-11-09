import WomenEmpowermentHero from "@/components/WomenEmpowerment/WomenEmpowermentHero"
import WomenEmpowermentPrograms from "@/components/WomenEmpowerment/WomenEmpowermentPrograms"
import WomenEmpowermentImpact from "@/components/WomenEmpowerment/WomenEmpowermentImpact"
import WomenEmpowermentCTA from "@/components/WomenEmpowerment/WomenEmpowermentCTA"
import Navbar from "@/components/Shared/Navbar"
import Footer from "@/components/Shared/Footer"

export default function WomenEmpowermentPage() {
  return (
    <>
      <main className="flex-grow">
        <WomenEmpowermentHero />
        <WomenEmpowermentPrograms />
        <WomenEmpowermentImpact />
        <WomenEmpowermentCTA />
      </main>
    </>
  )
}
