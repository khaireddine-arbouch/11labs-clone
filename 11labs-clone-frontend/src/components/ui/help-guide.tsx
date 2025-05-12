"use client";

import { useState } from "react";
import { Button } from "./button";
import { IoCloseOutline, IoHelpCircleOutline } from "react-icons/io5";

interface HelpGuideProps {
  title: string;
  steps: {
    title: string;
    description: string;
  }[];
}

export function HelpGuide({ title, steps }: HelpGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <IoHelpCircleOutline className="h-5 w-5" />
        <span className="sr-only">Help</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setIsOpen(false)}
            >
              <IoCloseOutline className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>

            <h2 className="mb-4 text-xl font-semibold">{title}</h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="rounded-md bg-gray-50 p-4">
                  <h3 className="mb-2 font-medium">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
            
            <Button 
              className="mt-6 w-full"
              onClick={() => setIsOpen(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 