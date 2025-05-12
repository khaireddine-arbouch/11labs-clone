import Hero from "~/components/landing-page/hero"
import Features from "~/components/landing-page/features"
import Demo from "~/components/landing-page/demo"
import Testimonials from "~/components/landing-page/testimonials"
import Pricing from "~/components/landing-page/pricing"
import Faq from "~/components/landing-page/faq"
import Footer from "~/components/landing-page/footer"
import Navbar from "~/components/landing-page/navbar"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center">
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <Testimonials />
      <Pricing />
      <Faq />
      <Footer />
    </main>
  )
}
