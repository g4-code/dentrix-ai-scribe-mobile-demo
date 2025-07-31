"use client";

import PulseWave from "@/app/components/PulseWave";
import { Patient } from "./types";
import Image from "next/image";

interface PatientSelectionViewProps {
  onPatientSelect: (patient: Patient) => void;
}

export function PatientSelectionView({ onPatientSelect }: PatientSelectionViewProps) {
  const patients: Patient[] = [
    { name: "Vincente Akins", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/men/1.jpg" },
    { name: "Ally Rose", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/women/1.jpg" },
    { name: "Matthew Chung", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/men/2.jpg" },
    { name: "Lauren Coburn", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/women/2.jpg" },
    { name: "Madeline Carter", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/women/3.jpg" },
    { name: "Mike Shelton", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/men/3.jpg" },
    { name: "Adam Smith", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/men/4.jpg" },
    { name: "Kara Chung", status: "Prophy, 8wx1", picture: "https://randomuser.me/api/portraits/women/5.jpg" },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-full">
      {/* Mobile-optimized header */}
      <div className="flex justify-center items-center py-4 sm:py-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mobile-title">
          Voice AI
        </h3>
      </div>
      
      {/* Mobile-optimized description and voice button */}
      <div className="px-4 py-6 sm:px-6 sm:py-8 border-b border-gray-200 flex flex-col items-center">
        <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-md sm:max-w-lg mobile-body leading-relaxed mb-6 sm:mb-8">
          Start recording patient conversations and let Ascend handle live transcription and note-taking in your patient chart.
        </p>

        {/* Mobile-responsive Voice AI Button */}
        <div className="flex justify-center w-full">
          <PulseWave size={200} />
        </div>
      </div>

      {/* Mobile-optimized patient list */}
      <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 mobile-subtitle">
          Select from Arrived Patient
        </h3>
        
        {/* Mobile-first scrollable patient list */}
        <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto mobile-scroll">
          {patients.map((patient, index) => (
            <button 
              key={index}
              className="
                w-full
                flex 
                items-center 
                space-x-4 
                sm:space-x-5
                p-4 
                sm:p-5
                min-h-[60px]
                sm:min-h-[68px]
                hover:bg-blue-50 
                active:bg-blue-100
                focus:bg-blue-50
                rounded-lg 
                sm:rounded-xl
                cursor-pointer 
                bg-blue-50
                border
                border-blue-100
                hover:border-blue-200
                focus:border-blue-300
                mobile-transition
                mobile-focus
                mobile-tap
                text-left
              "
              onClick={() => onPatientSelect(patient)}
              aria-label={`Select patient ${patient.name}`}
            >
              {/* Mobile-optimized avatar */}
              <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  className="w-full h-full object-cover rounded-full"
                  alt={`${patient.name} profile picture`}
                  width={56}
                  height={56}
                  src={patient.picture}
                />
              </div>
              
              {/* Mobile-optimized patient info */}
              <div className="flex-1 min-w-0">
                <div className="text-base sm:text-lg font-semibold text-gray-900 truncate mobile-subtitle">
                  {patient.name}
                </div>
                <div className="text-sm sm:text-base text-gray-600 truncate mobile-body mt-1">
                  {patient.status}
                </div>
              </div>
              
              {/* Mobile touch indicator */}
              <div className="shrink-0 w-2 h-2 bg-blue-400 rounded-full opacity-60" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 