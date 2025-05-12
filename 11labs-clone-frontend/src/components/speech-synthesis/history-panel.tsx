"use client";

import { IoDownloadOutline, IoPlay, IoTrashOutline } from "react-icons/io5";
import { useState } from "react";
import type { HistoryItem as HistoryItemType } from "~/lib/history";
import { useAudioStore } from "~/stores/audio-store";
import { useVoiceStore } from "~/stores/voice-store";
import type { Voice } from "~/stores/voice-store";
import type { ServiceType } from "~/types/services";
import toast from "react-hot-toast";

type ErrorResponse = {
  error?: string;
};

export function HistoryPanel({
  service,
  searchQuery,
  setSearchQuery,
  hoveredItem,
  setHoveredItem,
  historyItems: initialHistoryItems = [],
}: {
  service: ServiceType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
  historyItems?: HistoryItemType[];
}) {
  const { playAudio } = useAudioStore();
  const getVoices = useVoiceStore((state) => state.getVoices);
  const voices = getVoices(service);
  const [historyItems, setHistoryItems] = useState<HistoryItemType[]>(initialHistoryItems);
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});

  const handlePlayHistoryItem = (item: HistoryItemType) => {
    if (item.audioUrl) {
      playAudio({
        id: item.id.toString(),
        title: item.title,
        voice: item.voice,
        audioUrl: item.audioUrl,
        service: item.service,
      });
    }
  };

  const handleDownloadHistoryItem = (item: HistoryItemType) => {
    if (item.audioUrl) {
      const link = document.createElement("a");
      link.href = item.audioUrl;
      link.download = `${item.title || "audio"}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteHistoryItem = async (item: HistoryItemType) => {
    setIsDeleting(prev => ({ ...prev, [item.id]: true }));
    
    try {
      const response = await fetch(`/api/history?id=${item.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the item from the local state
        setHistoryItems(prev => prev.filter(histItem => histItem.id !== item.id));
        toast.success("Deleted successfully");
      } else {
        const errorData = await response.json() as ErrorResponse;
        toast.error(errorData.error ?? "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Recalculate grouped items when historyItems change
  const groupedItems = historyItems
    .filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        voices
          .find((voice) => voice.id === item.voice)
          ?.name.toLowerCase()
          .includes(searchQuery.toLowerCase()),
    )
    .reduce((groups: Record<string, typeof historyItems>, item) => {
      const date = item.date;
      groups[date] ??= [];
      groups[date].push(item);
      return groups;
    }, {});

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="w-full flex-shrink-0 mb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm focus:border-black dark:focus:border-gray-400 focus:ring-1 focus:ring-black dark:focus:ring-gray-400 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      {historyItems.length > 0 ? (
        <div className="flex flex-1 w-full flex-col overflow-y-auto">
          {/* Filter history items based on search */}
          {Object.entries(groupedItems).length > 0 ? (
            Object.entries(groupedItems).map(([date, items], groupIndex) => (
              <div key={date}>
                <div className="sticky top-0 z-10 my-2 flex w-full justify-center bg-background py-1">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs dark:text-gray-300">
                    {date}
                  </div>
                </div>

                {items.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    voices={voices}
                    hoveredItem={hoveredItem}
                    setHoveredItem={setHoveredItem}
                    onPlay={handlePlayHistoryItem}
                    onDownload={handleDownloadHistoryItem}
                    onDelete={handleDeleteHistoryItem}
                    isDeleting={isDeleting[item.id] ?? false}
                  />
                ))}
              </div>
            ))
          ) : (
            <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found
            </p>
          )}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">No history items yet</p>
        </div>
      )}
    </div>
  );
}

function HistoryItem({
  item,
  voices,
  hoveredItem,
  setHoveredItem,
  onPlay,
  onDownload,
  onDelete,
  isDeleting,
}: {
  item: HistoryItemType;
  voices: Voice[];
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
  onPlay: (item: HistoryItemType) => void;
  onDownload: (item: HistoryItemType) => void;
  onDelete: (item: HistoryItemType) => void;
  isDeleting: boolean;
}) {
  const voiceUsed =
    voices.find((voice) => voice.id === item.voice) ?? voices[0]!;

  return (
    <div
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className="relative flex items-center rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="flex w-full flex-col gap-1">
        <div className="relative w-full">
          <p className="truncate text-sm dark:text-gray-200">{item.title || "No title"}</p>
          {hoveredItem === item.id && (
            <div className="absolute top-0 right-0 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 pl-2">
              <button
                onClick={() => onPlay(item)}
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <IoPlay className="h-5 w-5 dark:text-gray-300" />
              </button>
              <button 
                onClick={() => onDownload(item)}
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <IoDownloadOutline className="h-5 w-5 dark:text-gray-300" />
              </button>
              <button 
                onClick={() => onDelete(item)}
                disabled={isDeleting}
                className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500"
              >
                {isDeleting ? (
                  <span className="h-5 w-5 flex items-center justify-center">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500"></span>
                  </span>
                ) : (
                  <IoTrashOutline className="h-5 w-5 dark:text-gray-300" />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <div
            className="flex h-3 w-3 items-center justify-center rounded-full text-xs text-white"
            style={{ background: voiceUsed.gradientColors }}
          ></div>
          <span className="text-xs font-light text-gray-500 dark:text-gray-400">
            {voiceUsed.name}
          </span>
          <span className="text-xs font-light text-gray-500 dark:text-gray-400">·</span>
          <span className="text-xs font-light text-gray-500 dark:text-gray-400">
            {item.time || "now"}
          </span>
        </div>
      </div>
    </div>
  );
}
