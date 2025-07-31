"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessViewProps {
  onStartNewRecording: () => void;
}

export function SuccessView({ onStartNewRecording }: SuccessViewProps) {
  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        {/* Success Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Success!
        </h2>

        {/* Success Message */}
        <p className="text-gray-600 leading-relaxed mb-8 max-w-sm">
          Ascend Voice AI has saved the clinical note successfully. Please go back to your desktop to finish editing and importing the note.
        </p>

        {/* Start New Recording Button */}
        <Button
          onClick={onStartNewRecording}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
        >
          START NEW RECORDING
        </Button>
      </div>
    </div>
  );
} 