"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Patient, Template } from "./types";

interface TemplateSelectionViewProps {
  selectedPatient: Patient;
  onTemplateSelect: (template: Template) => void;
}

export function TemplateSelectionView({ selectedPatient, onTemplateSelect }: TemplateSelectionViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("Select");

  const templates: Template[] = [
    { name: "Cancelled Appt < 24-Hr Notice" },
    { name: "Patient Dismissed" },
    { name: "Anesthetic, Specific Tooth" },
    { name: "Patient Failed Confirmed Appt" },
    { name: "Return Appointment" },
    { name: "Oral Hygiene" },
    { name: "Patient Health" },
  ];

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-full">
      {/* Mobile-optimized search section */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-5">
        {/* Mobile-friendly search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-4 sm:h-4" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              pl-12 
              pr-4 
              bg-gray-50 
              border 
              border-gray-300 
              rounded-lg 
              sm:rounded-xl
              h-12 
              sm:h-14
              text-base
              sm:text-sm
              text-gray-700
              mobile-focus
              mobile-transition
              touch-manipulation
              mobile-tap
            "
          />
        </div>

        {/* Mobile-optimized filter dropdown */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-sm sm:text-base font-semibold text-gray-700 mobile-subtitle">
            Filter by
          </label>
          <div className="relative">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="
                w-full 
                h-12 
                sm:h-14
                px-4 
                bg-gray-50 
                border 
                border-gray-300 
                rounded-lg
                sm:rounded-xl
                text-base
                sm:text-sm
                text-gray-700 
                appearance-none 
                cursor-pointer 
                mobile-focus
                mobile-transition
                mobile-tap
              "
            >
              <option value="Select" disabled>Select</option>
              <option value="All">All Templates</option>
              <option value="Recent">Recently Used</option>
              <option value="Favorites">Favorites</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mobile-optimized frequently used section */}
      <div className="flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6 mobile-subtitle">
          Frequently Used
        </h3>
        
        {/* Mobile-first scrollable template list */}
        <div className="space-y-3 sm:space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto mobile-scroll">
          {filteredTemplates.map((template, index) => (
            <button
              key={index}
              className="
                w-full
                p-4 
                sm:p-5
                min-h-[60px]
                sm:min-h-[68px]
                bg-blue-50 
                hover:bg-blue-100 
                active:bg-blue-200
                focus:bg-blue-100
                rounded-lg 
                sm:rounded-xl
                cursor-pointer 
                mobile-transition
                border 
                border-blue-100
                hover:border-blue-200
                focus:border-blue-300
                mobile-focus
                mobile-tap
                text-left
                group
              "
              onClick={() => onTemplateSelect(template)}
              aria-label={`Select template: ${template.name}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-blue-700 mobile-subtitle flex-1 pr-3">
                  {template.name}
                </span>
                <div className="shrink-0 w-2 h-2 bg-blue-400 rounded-full opacity-60 group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile-optimized selected patient info */}
      <div className="mt-auto px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 border-t border-gray-200">
        <div className="text-sm sm:text-base text-gray-600 mobile-body">
          Selected Patient: <span className="font-semibold text-gray-800">{selectedPatient.name}</span>
        </div>
      </div>
    </div>
  );
} 