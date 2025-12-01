import HomePageHero from "../components/HomePage/HomePageHero"
import HomePageCTA from "../components/HomePage/HomePageCTA"
import HomePageAbout from "../components/HomePage/HomePageAbout"
import HomePageImpact from "../components/HomePage/HomePageImpact"
import HomeCarousel from "@/components/HomePage/HomeCarousel"
import HomeSubscribe from "@/components/HomePage/HomeSubscribe"
import HomeCards from "@/components/HomePage/HomeCards"

export const metadata = {
  title: "Prayas by Aarya Foundation - Making a Difference Together",
  description:
    "Join Prayas by Aarya Foundation in creating positive change worldwide. Support our mission through donations, volunteering, and community engagement.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-[1px]">
        <HomeCarousel />
        <HomeCards />
        <HomePageHero />
        <HomePageAbout />
        <HomePageImpact />
        <HomePageCTA />
        <HomeSubscribe />
      </main>
    </div>
  )
}
