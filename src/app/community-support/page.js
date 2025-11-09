

import CommunityHero from "@/components/CommunitySupport/CommunityHero"
import CommunityPrograms from "@/components/CommunitySupport/CommunityPrograms"
import CommunityImpact from "@/components/CommunitySupport/CommunityImpact"
import CommunityCTA from "@/components/CommunitySupport/CommunityCTA"

export default function CommunitySupportPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Page Content */}
      <main className="flex-grow">
        <CommunityHero />
        <CommunityPrograms />
        <CommunityImpact />
        <CommunityCTA />
      </main>
    </div>
  )
}

