"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
  onStartNewRecording: () => void;
}

export function SuccessView({ onStartNewRecording }: SuccessViewProps) {
  return (
    <div className="flex-1 flex flex-col bg-white h-full min-h-full">
      {/* Mobile-optimized content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:px-8 sm:py-12 text-center">
        {/* Mobile-optimized success icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 shadow-lg">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-green-600" />
        </div>

        {/* Mobile-optimized success heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 mobile-title">
          Success!
        </h2>

        {/* Mobile-optimized success message */}
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8 sm:mb-10 max-w-xs sm:max-w-sm md:max-w-md mobile-body text-center">
          Ascend Voice AI has saved the clinical note successfully. Please go back to your desktop to finish editing and importing the note.
        </p>

        {/* Mobile-optimized start new recording button */}
        <Button
          onClick={onStartNewRecording}
          className="
            bg-blue-600 
            hover:bg-blue-700 
            active:bg-blue-800
            text-white 
            px-8 
            py-4 
            sm:px-10 
            sm:py-5
            rounded-lg 
            sm:rounded-xl
            font-bold 
            shadow-lg 
            hover:shadow-xl
            mobile-transition
            mobile-button-lg
            mobile-focus
            text-base
            sm:text-lg
            md:text-xl
            tracking-wide
            min-h-[56px]
            sm:min-h-[64px]
          "
          aria-label="Start a new recording session"
        >
          START NEW RECORDING
        </Button>
      </div>
    </div>
  );
} 