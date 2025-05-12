"use client";

import { useEffect, useState } from "react";
import {
  IoBookOutline,
  IoFilmOutline,
  IoGameControllerOutline,
  IoHappyOutline,
  IoLanguageOutline,
  IoLeafOutline,
  IoMegaphoneOutline,
  IoMicOutline,
} from "react-icons/io5";
import type { ServiceType } from "~/types/services";
import { GenerateButton } from "../client/generate-button";
import {
  generateTextToSpeech,
  generationStatus,
} from "~/actions/generate-speech";
import { useVoiceStore } from "~/stores/voice-store";
import { useAudioStore } from "~/stores/audio-store";
import toast from "react-hot-toast";
import { HelpGuide } from "../ui/help-guide";

export default function TextToSpeechEditor({
  service,
  credits,
}: {
  service: ServiceType;
  credits: number;
}) {
  const [textContent, setTextContent] = useState("");
  const [activePlaceholder, setActivePlaceholder] = useState(
    "Start typing here or paste any text you want to turn into lifelike speech...",
  );
  const [loading, setLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);

  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);

  const { playAudio } = useAudioStore();

  useEffect(() => {
    if (!currentAudioId || !loading) return;

    const pollInterval = setInterval(() => {
      const checkStatus = async () => {
        try {
          const status = await generationStatus(currentAudioId);

          const selectedVoice = getSelectedVoice("styletts2");
          if (status.success && status.audioUrl && selectedVoice) {
            clearInterval(pollInterval);
            setLoading(false);

            const newAudio = {
              id: currentAudioId,
              title:
                textContent.substring(0, 50) +
                (textContent.length > 50 ? "..." : ""),
              audioUrl: status.audioUrl,
              voice: selectedVoice.id,
              duration: "0:30",
              progress: 0,
              service: service,
              createdAt: new Date().toLocaleDateString(),
            };

            playAudio(newAudio);
            setCurrentAudioId(null);
          } else if (!status.success) {
            clearInterval(pollInterval);
            setLoading(false);
            setCurrentAudioId(null);
            console.error("Text to speech failed");
          }
        } catch (error) {
          console.error("Error polling for audio status:", error);
          clearInterval(pollInterval);
          setLoading(false);
          setCurrentAudioId(null);
        }
      };
      
      void checkStatus();
    }, 500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [
    currentAudioId,
    loading,
    getSelectedVoice,
    playAudio,
    textContent,
    service,
  ]);

  const templateTexts = {
    "Narrate a story":
      "Deep beneath the waves, where sunlight barely reached, a curious dolphin discovered a glowing orb nestled in the coral. As it nudged the orb, a surge of warmth spread through the ocean. Was this the key to the ancient songs long lost to time?",
    
    "Tell a silly joke":
      "What did the janitor say when he jumped out of the closet? 'Supplies!' And if you thought that was bad, wait until you hear my pun about chemistry – but I won’t tell it unless I get a reaction.",
    
    "Record an advertisement":
      "Say goodbye to boring mornings with BrewBurst – the smart coffee maker that syncs with your schedule and personal taste. Whether you're a bold espresso lover or prefer a gentle vanilla roast, BrewBurst delivers perfection, every cup. Order today and receive a free custom mug!",
    
    "Speak in different languages":
      "Hi there! 你好! Salut! 안녕하세요! Olá! Привет! Whether you're saying hello in Mandarin or goodbye in French, I can be your multilingual companion. Let's break language barriers together!",
    
    "Direct a dramatic movie scene":
      "The candle flickered as Marcus loaded the last bullet into the revolver. 'We don’t run anymore,' he growled. Across the room, Eliza stepped forward, eyes burning. 'Then we fight — for everything we lost.' The silence before the storm echoed louder than any thunder.",
    
    "Hear from a video game character":
      "Hey, rookie! This is Zara Hex from the Resistance outpost. We're pinned down near Sector 12, and we could really use a tech expert like you. The mechs are evolving, adapting faster than we predicted. Grab your gear — we move at dawn.",
    
    "Introduce your podcast":
      "You're listening to 'Hidden Frequencies,' the show that tunes into the whispers of the unknown. I’m Casey Wren, and today, we’re decoding the strange signals intercepted by a ham radio operator deep in the Mojave Desert. Buckle up — things are about to get weird.",
    
    "Guide a meditation class":
      "Find a quiet space, and gently allow your eyes to close. Inhale deeply, as if breathing in calm itself. Hold it... and exhale, releasing every worry. With each breath, picture a wave of serenity washing over you, grounding you in the present moment. Just breathe — and be."
  };
  

  const handleButtonHover = (text: string) => {
    setActivePlaceholder(templateTexts[text as keyof typeof templateTexts]);
  };

  const handleButtonClick = (text: string) => {
    setTextContent(templateTexts[text as keyof typeof templateTexts]);
  };

  const handleGenerateSpeech = async () => {
    const selectedVoice = getSelectedVoice("styletts2");

    if (textContent.trim().length === 0 || !selectedVoice) return;

    try {
      setLoading(true);
      const { audioId, shouldShowThrottleAlert } = await generateTextToSpeech(
        textContent,
        selectedVoice?.id,
      );

      if (shouldShowThrottleAlert) {
        toast("Exceeding 3 requests per minute will queue your requests.", {
          icon: "⏳",
        });
      }

      setCurrentAudioId(audioId);
    } catch (error) {
      console.error("Error generating speech:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {textContent.length}/5000 characters
        </div>
        <HelpGuide 
          title="How to Use Text-to-Speech" 
          steps={[
            {
              title: "Select a Voice",
              description: "Choose from the available voices in the sidebar panel."
            },
            {
              title: "Enter Your Text",
              description: "Type or paste the text you want to convert to speech in the text area."
            },
            {
              title: "Generate",
              description: "Click the Generate button at the bottom to create your audio."
            },
            {
              title: "Listen and Download",
              description: "Use the audio player controls to listen to your generated speech and download it for later use."
            }
          ]}
        />
      </div>
      <textarea
        value={textContent}
        onChange={(e) => setTextContent(e.target.value)}
        placeholder={activePlaceholder}
        disabled={loading}
        className="w-full flex-grow resize-none rounded-lg bg-white p-4 text-gray-900 dark:bg-gray-800 dark:text-gray-100 placeholder:font-light placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0"
      />

      <div className="mt-4 px-0 md:px-4">
        {textContent.length === 0 ? (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Get started with</p>

            <div className="flex flex-wrap gap-2">
              {[
                { text: "Narrate a story", icon: <IoBookOutline /> },
                { text: "Tell a silly joke", icon: <IoHappyOutline /> },
                {
                  text: "Record an advertisement",
                  icon: <IoMegaphoneOutline />,
                },
                {
                  text: "Speak in different languages",
                  icon: <IoLanguageOutline />,
                },
                {
                  text: "Direct a dramatic movie scene",
                  icon: <IoFilmOutline />,
                },
                {
                  text: "Hear from a video game character",
                  icon: <IoGameControllerOutline />,
                },
                {
                  text: "Introduce your podcast",
                  icon: <IoMicOutline />,
                },
                {
                  text: "Guide a meditation class",
                  icon: <IoLeafOutline />,
                },
              ].map(({ text, icon }) => (
                <button
                  key={text}
                  className="flex items-center rounded-lg border border-gray-200 bg-white p-2 text-xs text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                  onMouseEnter={() => handleButtonHover(text)}
                  onMouseLeave={() =>
                    setActivePlaceholder(
                      "Start typing here or paste any text you want to turn into lifelike speech...",
                    )
                  }
                  onClick={() => handleButtonClick(text)}
                >
                  <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <GenerateButton
            onGenerate={handleGenerateSpeech}
            isDisabled={
              textContent.length > 5000 ||
              textContent.trim().length === 0 ||
              loading
            }
            isLoading={loading}
            showDownload={true}
            creditsRemaining={credits}
            showCredits={true}
            characterCount={textContent.length}
            characterLimit={5000}
          />
        )}
      </div>
    </>
  );
}