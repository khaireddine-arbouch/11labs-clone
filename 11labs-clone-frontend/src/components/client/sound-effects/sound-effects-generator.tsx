"use client";

import { useEffect, useState } from "react";
import { useAudioStore } from "~/stores/audio-store";
import { GenerateButton } from "../generate-button";
import { BiDoorOpen } from "react-icons/bi";
import {
  IoCarSportOutline,
  IoThunderstormOutline,
  IoLeafOutline,
  IoPeopleOutline,
  IoWaterOutline,
  IoHardwareChipOutline,
  IoAirplaneOutline,
  IoPlayOutline,
  IoDownloadOutline,
  IoVolumeHighOutline,
  IoTrashOutline,
} from "react-icons/io5";
import {
  generateSoundEffect as generateSoundEffectAction,
  generationStatus as generationStatusAction,
} from "~/actions/generate-speech";
import toast from "react-hot-toast";
import type { HistoryItem } from "~/lib/history";

const MAX_CHARS = 500;

type ErrorResponse = {
  error?: string;
};

interface GenerationResponse {
  audioId: string;
  shouldShowThrottleAlert: boolean;
}

interface StatusResponse {
  success: boolean;
  audioUrl: string | null;
}

// Type-safe wrapper functions for server actions
const generateSoundEffect = async (prompt: string): Promise<GenerationResponse> => {
  const result = await generateSoundEffectAction(prompt);
  return result as unknown as GenerationResponse;
};

const generationStatus = async (audioId: string): Promise<StatusResponse> => {
  const result = await generationStatusAction(audioId);
  return result as unknown as StatusResponse;
};

export function SoundEffectsGenerator({ credits }: { credits: number }) {
  const [textContent, setTextContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState(
    "Describe your sound effect and then click generate...",
  );
  const [loading, setLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const { playAudio } = useAudioStore();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  const isTextEmpty = textContent.trim() === "";

  // Fetch history items on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history?service=make-an-audio');
        if (response.ok) {
          const data = await response.json() as HistoryItem[];
          setHistoryItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
      }
    };

    void fetchHistory();
  }, []);

  const handleDeleteHistoryItem = async (itemId: string) => {
    setIsDeleting(prev => ({ ...prev, [itemId]: true }));
    
    try {
      const response = await fetch(`/api/history?id=${itemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the item from the local state
        setHistoryItems(prev => prev.filter(item => item.id !== itemId));
        toast.success("Deleted successfully");
      } else {
        const errorData = await response.json() as ErrorResponse;
        toast.error(errorData.error ?? "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleGenerateSoundEffect = async () => {
    if (isTextEmpty) return;

    try {
      setLoading(true);
      const result = await generateSoundEffect(textContent);
      if (result.shouldShowThrottleAlert) {
        toast("Exceeding 3 requests per minute will queue your requests.", {
          icon: "⏳",
        });
      }
      setCurrentAudioId(result.audioId);
    } catch (error) {
      console.error("Error generating sound effect:", error);
      setLoading(false);
    }
  };

  const templateTexts = {
    "Car engine revving":
      "A powerful sports car engine revving up, starting low and building to a high-pitched roar with the sound of turbocharger spooling",
    "Heavy rainstorm":
      "Heavy rain pouring down with occasional thunder in the background, rain hitting windows and roof",
    "Forest ambience":
      "Peaceful forest sounds with birds chirping, leaves rustling in the wind, and a small stream flowing nearby",
    "Stadium crowd cheering":
      "A large stadium crowd erupting in cheers and applause after a goal or touchdown, with whistles and horns",
    "Ocean waves":
      "Ocean waves crashing against a rocky shore, with the rhythmic sound of water rushing in and receding",
    "Robot sounds":
      "Futuristic robot powering up with mechanical servo sounds, beeps, and electronic processing noises",
    "Creaky door":
      "Old wooden door slowly opening with an eerie creak, hinges squeaking in a haunted house",
    "Helicopter flyby":
      "Helicopter approaching from a distance, passing overhead with loud rotor blades, then flying away",
  };

  useEffect(() => {
    if (!currentAudioId || !loading) return;

    const pollInterval = setInterval(() => {
      const checkStatus = async () => {
        try {
          const status = await generationStatus(currentAudioId);
  
          if (status.success && status.audioUrl) {
            clearInterval(pollInterval);
            setLoading(false);
  
            const newAudio = {
              id: currentAudioId,
              title:
                textContent.substring(0, 50) +
                (textContent.length > 50 ? "..." : ""),
              audioUrl: status.audioUrl,
              voice: "",
              duration: "0:30",
              progress: 0,
              service: "make-an-audio",
              createdAt: new Date().toLocaleDateString(),
            };
  
            playAudio(newAudio);
            setCurrentAudioId(null);
            
            // Add the new item to history and refresh history list
            const fetchHistory = async () => {
              try {
                const response = await fetch('/api/history?service=make-an-audio');
                if (response.ok) {
                  const data = await response.json() as HistoryItem[];
                  setHistoryItems(data);
                }
              } catch (error) {
                console.error('Failed to fetch updated history:', error);
              }
            };
            
            // Wait a bit to ensure the audio has been saved to the database
            setTimeout(() => {
              void fetchHistory();
            }, 1000);
          } else if (!status.success) {
            clearInterval(pollInterval);
            setLoading(false);
            setCurrentAudioId(null);
            console.error("Sound effect generation failed");
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
  }, [currentAudioId, loading, playAudio, textContent]);

  // Group history items by date
  const groupedItems = historyItems.reduce(
    (groups: Record<string, HistoryItem[]>, item) => {
      const date = item.date;
      groups[date] ??= [];
      groups[date].push(item);
      return groups;
    },
    {},
  );

  return (
    <>
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <div className="relative flex h-full w-full flex-col items-center">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 transform">
          <div
            className="h-[200px] w-full bg-gradient-to-r from-teal-300 via-blue-300 to-teal-300 opacity-20 blur-[70px] dark:from-teal-600 dark:via-blue-600 dark:to-teal-600 dark:opacity-10"
            style={{ animation: "gradientMove 20s ease infinite" }}
          ></div>
        </div>

        <div className="relative z-10 flex h-full w-full flex-col items-center gap-6 md:pt-20">
          <div
            className={`h-fit w-full max-w-2xl rounded-xl border bg-white dark:bg-gray-800 p-4 shadow-xl transition-colors duration-200 ${isFocused ? "border-black dark:border-white" : "border-gray-200 dark:border-gray-700"}`}
          >
            <div className="flex flex-col">
              <textarea
                value={textContent}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= MAX_CHARS) {
                    setTextContent(text);
                  }
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                maxLength={MAX_CHARS}
                placeholder={activePlaceholder}
                className="h-16 resize-none rounded-md p-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder:font-light placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0"
              />
              <div className="mt-1 flex w-full justify-end">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {textContent.length}/{MAX_CHARS}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <GenerateButton
                  onGenerate={handleGenerateSoundEffect}
                  isDisabled={isTextEmpty || loading}
                  isLoading={loading}
                  buttonText="Generate Sound Effect"
                  showDownload={false}
                  creditsRemaining={credits}
                  fullWidth={false}
                />
              </div>
            </div>
          </div>

          <div className="h-fit w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
            <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
              Try a sound effect example
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                { text: "Car engine revving", icon: <IoCarSportOutline /> },
                { text: "Heavy rainstorm", icon: <IoThunderstormOutline /> },
                { text: "Forest ambience", icon: <IoLeafOutline /> },
                { text: "Stadium crowd cheering", icon: <IoPeopleOutline /> },
                { text: "Ocean waves", icon: <IoWaterOutline /> },
                { text: "Robot sounds", icon: <IoHardwareChipOutline /> },
                { text: "Creaky door", icon: <BiDoorOpen /> },
                { text: "Helicopter flyby", icon: <IoAirplaneOutline /> },
              ].map(({ text, icon }) => (
                <button
                  className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-xs text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  key={text}
                  onClick={() => {
                    setTextContent(templateTexts[text as keyof typeof templateTexts]);
                  }}
                >
                  <span className="mr-2 text-gray-500 dark:text-gray-400">
                    {icon}
                  </span>
                  {text}
                </button>
              ))}
            </div>
          </div>

          {historyItems.length > 0 && (
            <div className="h-fit w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-lg">
              <h2 className="mb-4 text-center text-lg font-medium text-gray-900 dark:text-gray-100">
                Your Sound Effects
              </h2>
              <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto">
                {Object.entries(groupedItems).map(([date, items]) => (
                  <div key={date} className="mb-3">
                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                      {date}
                    </p>
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="mb-1 flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-black">
                            <IoVolumeHighOutline className="h-4 w-4 text-black dark:text-white" />
                          </div>
                          <p className="ml-2 max-w-[200px] truncate text-sm text-gray-900 dark:text-gray-100">
                            {item.title}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                            onClick={() => {
                              if (item.audioUrl) {
                                playAudio({
                                  id: item.id,
                                  title: item.title,
                                  audioUrl: item.audioUrl,
                                  voice: "",
                                  duration: "0:30",
                                  progress: 0,
                                  service: "make-an-audio",
                                  createdAt: item.date,
                                });
                              }
                            }}
                          >
                            <IoPlayOutline className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          </button>
                          {item.audioUrl && (
                            <a
                              href={item.audioUrl}
                              download={`${item.title}.mp3`}
                              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <IoDownloadOutline className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteHistoryItem(item.id)}
                            disabled={isDeleting[item.id]}
                            className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-red-500"
                          >
                            {isDeleting[item.id] ? (
                              <span className="h-5 w-5 flex items-center justify-center">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500"></span>
                              </span>
                            ) : (
                              <IoTrashOutline className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}