

import HealthcareHero from "@/components/Healthcare/HealthcareHero"
import HealthcarePrograms from "@/components/Healthcare/HealthcarePrograms"
import HealthcareImpact from "@/components/Healthcare/HealthcareImpact"
import HealthcareCTA from "@/components/Healthcare/HealthcareCTA"

export default function HealthcarePage() {
  return (
    <div className="">


      {/* Page Content */}
      <main className="flex-grow">
        <HealthcareHero />
        <HealthcarePrograms />
        <HealthcareImpact />
        <HealthcareCTA />
      </main>

    </div>
  )
}

