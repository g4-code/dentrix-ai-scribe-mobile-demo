"use client";

import PulseWave from "@/app/components/PulseWave";
import { Button } from "../ui/button";

interface PatientSelectionViewProps {
  onStartAppointment: () => void;
}

export function WelcomeView({ onStartAppointment }: PatientSelectionViewProps) {

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Mobile-optimized header */}
      <div className="flex justify-center items-center py-4 sm:py-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mobile-title">
          Welcome to Ascend Voice AI
        </h3>
      </div>
      
      {/* Mobile-optimized description and voice button */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 border-b border-gray-200 flex flex-col items-center">
        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-md sm:max-w-lg mobile-body leading-relaxed mb-6 sm:mb-8">
          Start recording patient conversations and let Ascend handle live transcription and note-taking in real time.
        </p>

        {/* Mobile-responsive Voice AI Button */}
        <div className="flex justify-center w-full">
          <PulseWave size={200} />
        </div>
        <Button style={{
          background:'#003C81',
          color:'white',
          cursor:'pointer',
        }} onClick={onStartAppointment}>Start Appointment</Button>
      </div>
    </div>
  );
} 