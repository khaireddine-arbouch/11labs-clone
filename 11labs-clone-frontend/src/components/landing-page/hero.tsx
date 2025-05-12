"use client"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48" id="hero">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Transform Text to Voice with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create lifelike voices, generate sound effects, and convert voices with our powerful AI platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="h-12" asChild>
                <Link href="/app/sign-up">Try for Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12" asChild>
                <a href="#demo">View Demo</a>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full max-w-[500px] overflow-hidden rounded-lg p-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full">
                  <Image src="/assets/placeholder.png" alt="Hero Image" width={500} height={400} className="object-cover"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WaveformAnimation() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-32 w-full items-end justify-around">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="bg-primary w-2 rounded-full"
            style={{
              height: `${Math.sin(i * 0.4) * 50 + 60}%`,
              animationDelay: `${i * 0.05}s`,
              animation: "waveform 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes waveform {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.5);
          }
        }
      `}</style>
    </div>
  )
}
