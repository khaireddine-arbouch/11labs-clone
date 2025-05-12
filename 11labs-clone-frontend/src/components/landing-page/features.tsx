import { Mic, Volume2, Wand2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function Features() {
  const features = [
    {
      icon: <Mic className="h-10 w-10 text-primary" />,
      title: "Text to Speech",
      description:
        "High-quality, realistic AI voices from simple text input. Choose from dozens of voices or create your own.",
    },
    {
      icon: <Wand2 className="h-10 w-10 text-primary" />,
      title: "Sound Effects Generator",
      description: "Instantly generate dynamic, context-aware sound effects from text descriptions for any project.",
    },
    {
      icon: <Volume2 className="h-10 w-10 text-primary" />,
      title: "Voice Converter",
      description:
        "Convert any voice into another style or persona with seamless quality and natural-sounding results.",
    },
  ]

  return (
    <section id="features" className="w-full bg-muted/50 py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Voice AI Tools</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform offers cutting-edge AI voice technology to transform how you create and work with audio.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {features.map((feature, i) => (
            <Card key={i} className="group relative overflow-hidden transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
