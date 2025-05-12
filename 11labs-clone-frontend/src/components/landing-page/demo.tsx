"use client"

import { useState, useRef } from "react"
import { Play, Pause, SkipForward } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('Error playing audio:', error)
        }
      }
    }
  }

  return (
    <section id="demo" className="w-full py-12 md:py-24 lg:py-32">
      <audio
        ref={audioRef}
        src="/assets/Voices/Text to speech/Finetuned_audio.wav"
        onEnded={() => setIsPlaying(false)}
      />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Demo</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See It in Action</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Experience the power of our AI voice technology with these interactive demos.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <Tabs defaultValue="text-to-speech" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text-to-speech">Text to Speech</TabsTrigger>
              <TabsTrigger value="sound-effects">Sound Effects</TabsTrigger>
              <TabsTrigger value="voice-converter">Voice Converter</TabsTrigger>
            </TabsList>

            <TabsContent value="text-to-speech" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm font-medium">Sample Text</p>
                      <p className="mt-2 text-muted-foreground">
                        "Hello my name is Khaireddine, I am a BAU student and I am now testing this model."
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Fine tuned voice</p>
                          <p className="text-xs text-muted-foreground">
                            {audioRef.current ? `${Math.floor(audioRef.current.currentTime)}:${Math.floor((audioRef.current.currentTime % 1) * 60).toString().padStart(2, '0')} / ${Math.floor(audioRef.current.duration)}:${Math.floor((audioRef.current.duration % 1) * 60).toString().padStart(2, '0')}` : '0:00 / 0:00'}
                          </p>
                        </div>
                      </div>
                      
                    </div>

                    <div className="h-24 rounded-lg bg-muted/50">
                      <div className="flex h-full items-center justify-center">
                        <div className="h-16 w-full px-4">
                          <WaveformVisualization isPlaying={isPlaying} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sound-effects" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm font-medium">Description</p>
                      <p className="mt-2 text-muted-foreground">
                        "A gentle rain shower with distant thunder and birds chirping in a forest"
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full" onClick={togglePlay}>
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Generated Sound Effect</p>
                          <p className="text-xs text-muted-foreground">0:00 / 0:30</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-24 rounded-lg bg-muted/50">
                      <div className="flex h-full items-center justify-center">
                        <div className="h-16 w-full px-4">
                          <WaveformVisualization isPlaying={isPlaying} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice-converter" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium">Original Voice</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={togglePlay}>
                            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <div className="h-8 w-full">
                            <WaveformVisualization isPlaying={isPlaying} />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium">Converted Voice</p>
                        <div className="mt-4 flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={togglePlay}>
                            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <div className="h-8 w-full">
                            <WaveformVisualization isPlaying={isPlaying} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium">Voice Style</p>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {["Professional", "Friendly", "Energetic", "Calm"].map((style) => (
                          <Button key={style} variant="outline" size="sm" className="h-auto py-1">
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

function WaveformVisualization({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-around">
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="bg-primary w-1 rounded-full"
          style={{
            height: `${Math.sin(i * 0.2) * 50 + 50}%`,
            animationPlayState: isPlaying ? "running" : "paused",
            animationDelay: `${i * 0.05}s`,
            animation: "waveform 1.2s ease-in-out infinite",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes waveform {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.6);
          }
        }
      `}</style>
    </div>
  )
}
