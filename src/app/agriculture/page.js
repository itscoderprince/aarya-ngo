

import AgricultureHero from "@/components/Agriculture/AgricultureHero";
import AgriculturePrograms from "@/components/Agriculture/AgriculturePrograms";
import AgricultureImpact from "@/components/Agriculture/AgricultureImpact";
import AgricultureCTA from "@/components/Agriculture/AgricultureCTA";

export default function AgriculturePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}


      {/* Page Content */}
      <main className="flex-grow">
        <AgricultureHero />
        <AgriculturePrograms />
        <AgricultureImpact />
        <AgricultureCTA />
      </main>

      {/* Footer */}

    </div>
  );
}
