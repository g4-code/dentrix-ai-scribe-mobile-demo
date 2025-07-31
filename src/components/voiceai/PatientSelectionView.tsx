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
    <div className="flex-1 flex flex-col">
      <div className="flex justify-center items-center">
        <h3 className=" font-bold text-gray-800" style={{
          fontSize:'30px'
        }}>
          Voice AI
        </h3>
      </div>
      {/* Description and Voice Button */}
      <div className="p-6 border-b border-gray-200 flex flex-col items-center" >
        <p className="text-sm text-gray-600 " style={{
          maxWidth:'400px',
          textAlign:'center'
        }}>
          Start recording patient conversations and let Ascend handle live transcription and note-taking in your patient chart.
        </p>

        {/* Voice AI Button */}
        <PulseWave size={250} />
      </div>

      {/* Patient List */}
      <div className="p-6 flex-1">
        <h3 className="text-sm font-medium text-gray-800 mb-4">Select from Arrived Patient</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {patients.map((patient, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-blue-50  rounded-md cursor-pointer bg-blue-100 "
              onClick={() => onPatientSelect(patient)}
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Image
                  className="rounded"
                  alt="picture_user"
                  width={50}
                  height={50}
                  src={patient.picture}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">{patient.name}</div>
                <div className="text-xs text-gray-500">{patient.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 