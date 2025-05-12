"use client";

import { useEffect, useRef, useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useVoiceStore } from "~/stores/voice-store";
import type { ServiceType } from "~/types/services";

export function VoiceSelector({ service }: { service: ServiceType }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use a single hook call for better devtool tracking
  const { getVoices, getSelectedVoice, selectVoice } = useVoiceStore((state) => ({
    getVoices: state.getVoices,
    getSelectedVoice: state.getSelectedVoice,
    selectVoice: state.selectVoice,
  }));

  const voices = getVoices(service);
  const selectedVoice = getSelectedVoice(service);

  // Avoid recreating the function on every render
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 hover:bg-opacity-30"
      >
        <div className="flex items-center">
          <div
            className="mr-2.5 h-4 w-4 rounded-full"
            style={{ background: selectedVoice?.gradientColors }}
          />
          <span className="text-sm">{selectedVoice?.name ?? "No voice selected"}</span>
        </div>
        {isOpen ? (
          <IoChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        ) : (
          <IoChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          {voices.map((voice) => (
            <button
              key={voice.id}
              type="button"
              className={`flex w-full items-center px-3 py-2 text-left text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                voice.id === selectedVoice?.id ? "bg-gray-50 dark:bg-gray-700" : ""
              }`}
              onClick={() => {
                selectVoice(service, voice.id);
                setIsOpen(false);
              }}
            >
              <div
                className="mr-2 h-4 w-4 rounded-full"
                style={{ background: voice.gradientColors }}
              />
              <span className="text-sm">{voice.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
