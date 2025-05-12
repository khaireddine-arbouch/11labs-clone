"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import type { ServiceType } from "~/types/services";
import { useUIStore } from "~/stores/ui-store";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { SpeechSidebar } from "../speech-synthesis/right-sidebar";
import type { HistoryItem } from "~/lib/history";
import Playbar from "./playbar";
import { useAudioStore } from "~/stores/audio-store";
import { MobileSettingsButton } from "../speech-synthesis/mobile-settings-button";
import { SidebarProvider, SidebarInset } from "~/components/ui/sidebar";
import AppSidebar from "~/components/client/sidebar";
import { SiteHeader } from "~/components/sidebar/site-header";

interface TabItem {
  name: string;
  path: string;
}

export function PageLayout({
  title,
  children,
  service,
  tabs,
  showSidebar = true,
  historyItems,
}: {
  title: string;
  children: ReactNode;
  service: ServiceType;
  tabs?: TabItem[];
  showSidebar: boolean;
  historyItems?: HistoryItem[];
}) {
  const pathname = usePathname();
  const {
    isMobileDrawerOpen,
    isMobileScreen,
    isMobileMenuOpen,
    toggleMobileDrawer,
    setMobileScreen,
    toggleMobileMenu,
    isRightSidebarCollapsed,
  } = useUIStore();
  const { currentAudio, isPlaybarOpen } = useAudioStore();

  useEffect(() => {
    const checkScreenSize = () => {
      setMobileScreen(window.innerWidth < 1024);
    };
    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setMobileScreen]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title}/>

        <div className="flex h-screen overflow-hidden">
          {/* Mobile Overlay */}
          {isMobileScreen && isMobileDrawerOpen && (
            <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
          )}

          {/* Mobile Drawer */}
          <div
            className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
              isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="shadow-log relative h-full w-64 bg-background dark:bg-background">
              <button
                onClick={toggleMobileDrawer}
                className="absolute right-2 top-2 rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <IoClose />
              </button>
              <AppSidebar variant="inset" />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Content Body */}
            <div 
              className="flex-1 overflow-hidden relative"
              style={{
                height: currentAudio && isPlaybarOpen ? "calc(100% - 80px)" : "100%",
              }}
            >
              <div className="flex h-full overflow-hidden">
                <div 
                  className={`flex-1 px-6 py-5 overflow-hidden transition-all duration-300 ease-in-out ${
                    showSidebar && service && !isRightSidebarCollapsed ? "" : "pr-6"
                  }`}
                >
                  <div className="flex h-full flex-col overflow-auto">{children}</div>
                </div>

                {/* Right Sidebar */}
                {showSidebar && service && (
                  <SpeechSidebar
                    historyItems={historyItems}
                    service={service}
                  />
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            {isMobileScreen &&
              !pathname.includes("/app/sound-effects") && (
                <MobileSettingsButton
                  toggleMobileMenu={toggleMobileMenu}
                />
              )}

            {currentAudio && <Playbar />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
