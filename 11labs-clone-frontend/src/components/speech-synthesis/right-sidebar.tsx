"use client";

import { useUIStore } from "~/stores/ui-store";
import type { ServiceType } from "~/types/services";
import { VoiceSelector } from "../client/voice-selector";
import { HistoryPanel } from "./history-panel";
import { useState } from "react";
import type { HistoryItem } from "~/lib/history";
import { IoClose } from "react-icons/io5";
import { useAudioStore } from "~/stores/audio-store";
import { ChevronRight } from "lucide-react";

export function SpeechSidebar({
  service,
  historyItems,
}: {
  service: ServiceType;
  historyItems?: HistoryItem[];
}) {
  const {
    activeTab,
    setActiveTab,
    isMobileMenuOpen,
    toggleMobileMenu,
    isMobileScreen,
    isRightSidebarCollapsed,
    toggleRightSidebar,
  } = useUIStore();

  const { currentAudio, isPlaybarOpen } = useAudioStore();
  
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {/* Desktop sidebar */}
      <div className="relative hidden md:block">
        {/* Collapse toggle button */}
        <button
          onClick={toggleRightSidebar}
          className="absolute -left-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm"
          aria-label="Toggle right sidebar"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${
              isRightSidebarCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>

        <div 
          className={`flex flex-col border-l bg-background dark:border-border p-5 overflow-hidden transition-all duration-300 ease-in-out ${
            isRightSidebarCollapsed ? "w-0 opacity-0 p-0 border-l-0" : "w-[350px] lg:w-[500px] opacity-100"
          }`}
          style={{
            height: currentAudio && isPlaybarOpen ? "calc(100% - 80px)" : "100%",
          }}
        >
          <div className="relative mb-6 flex-shrink-0">
            <div className="absolute bottom-0 left-0 right-0 border-b border-gray-200 dark:border-border"></div>
            <button
              onClick={() => setActiveTab("settings")}
              className={`relative z-10 mr-4 pb-2 text-sm transition-colors duration-200 ${activeTab === "settings" ? "border-b-2 border-black dark:border-white text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`relative z-10 mr-4 pb-2 text-sm transition-colors duration-200 ${activeTab === "history" ? "border-b-2 border-black dark:border-white text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              History
            </button>
          </div>
          <div className="transition-opacity duration-200 flex-1 overflow-hidden">
            {activeTab === "settings" ? (
              <div className="mb-6">
                <h2 className="mb-2 text-sm dark:text-gray-200">Voice</h2>
                <VoiceSelector service={service} />
              </div>
            ) : (
              <HistoryPanel
                service={service}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                historyItems={historyItems}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileScreen && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-h-[80vh] overflow-y-auto rounded-t-xl bg-background dark:bg-background p-5 shadow-lg">
          <div className="mb-4 flex items-center justify-end">
            <button onClick={toggleMobileMenu}>
              <IoClose className="h-4 w-4 dark:text-gray-300" />
            </button>
          </div>

          {/* Tabs */}
          <div className="relative mb-6 flex">
            <div className="absolute bottom-0 left-0 right-0 border-b border-gray-200 dark:border-border"></div>
            <button
              onClick={() => setActiveTab("settings")}
              className={`relative z-10 mr-4 pb-2 text-sm transition-colors duration-200 ${activeTab === "settings" ? "border-b-2 border-black dark:border-white text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`relative z-10 mr-4 pb-2 text-sm transition-colors duration-200 ${activeTab === "history" ? "border-b-2 border-black dark:border-white text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
            >
              History
            </button>
          </div>

          {/* Tab content */}
          <div className="transition-opacity duration-200">
            {activeTab === "settings" ? (
              <div className="mb-6">
                <h2 className="mb-2 text-sm dark:text-gray-200">Voice</h2>
                <VoiceSelector service={service} />
              </div>
            ) : (
              <HistoryPanel
                service={service}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
                historyItems={historyItems}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}