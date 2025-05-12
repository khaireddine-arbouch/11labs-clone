"use client";

import { useState } from "react";
import { useVoiceStore } from "~/stores/voice-store";
import { IoPlayOutline, IoPauseOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useAudioStore } from "~/stores/audio-store";
import { generateTextToSpeech, generationStatus } from "~/actions/generate-speech";
import toast from "react-hot-toast";

const SAMPLE_TEXT = "This is a preview of how this voice sounds. You can use it for your projects.";

export default function VoiceLibrary({ credits }: { credits: number }) {
  const { voices, selectVoice } = useVoiceStore();
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const { playAudio } = useAudioStore();
  
  const availableVoices = voices.filter(voice => voice.service === "styletts2");

  const handlePlayPreview = async (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
      return;
    }

    setLoading(voiceId);
    try {
      const { audioId, shouldShowThrottleAlert } = await generateTextToSpeech(
        SAMPLE_TEXT,
        voiceId
      );

      if (shouldShowThrottleAlert) {
        toast("Exceeding 3 requests per minute will queue your requests.", {
          icon: "⏳",
        });
      }

      // Poll for the result
      const checkStatus = async () => {
        const status = await generationStatus(audioId);
        if (status.success && status.audioUrl) {
          const voice = availableVoices.find(v => v.id === voiceId);
          
          const newAudio = {
            id: audioId,
            title: `${voice?.name || "Voice"} Preview`,
            audioUrl: status.audioUrl,
            voice: voiceId,
            duration: "0:10",
            progress: 0,
            service: "styletts2",
            createdAt: new Date().toLocaleDateString(),
          };

          playAudio(newAudio);
          setPlayingVoice(voiceId);
          setLoading(null);
        } else if (!status.success) {
          toast.error("Failed to generate voice preview");
          setLoading(null);
        } else {
          setTimeout(checkStatus, 500);
        }
      };

      checkStatus();
    } catch (error) {
      console.error("Error generating voice preview:", error);
      toast.error("Failed to generate voice preview");
      setLoading(null);
    }
  };

  const handleUseVoice = (voiceId: string) => {
    selectVoice("styletts2", voiceId);
    toast.success("Voice selected! Go to Text-to-Speech to use it.");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Voice Library</h2>
        <p className="text-muted-foreground">
          Browse and preview the available voices for your text-to-speech projects.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {availableVoices.map((voice) => (
          <Card key={voice.id} className="overflow-hidden">
            <div 
              className="h-24 w-full" 
              style={{ 
                background: voice.gradientColors,
                backgroundSize: "200% 200%",
                animation: "gradient 5s ease infinite"
              }}
            />
            <CardHeader className="pb-2">
              <CardTitle>{voice.name}</CardTitle>
              <CardDescription>High-quality AI voice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Perfect for narration, podcasts, videos and more.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handlePlayPreview(voice.id)}
                disabled={loading !== null}
              >
                {loading === voice.id ? (
                  <span className="flex items-center">
                    <svg className="h-4 w-4 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading
                  </span>
                ) : playingVoice === voice.id ? (
                  <>
                    <IoPauseOutline className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <IoPlayOutline className="mr-2 h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
              <Button 
                size="sm"
                onClick={() => handleUseVoice(voice.id)}
              >
                Use This Voice
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
} 