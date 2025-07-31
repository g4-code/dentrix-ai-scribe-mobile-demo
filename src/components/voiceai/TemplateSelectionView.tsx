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
    <div className="flex-1 flex flex-col">
      {/* Search Section */}
      <div className="p-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border border-gray-300 rounded-lg h-12 text-gray-700"
          />
        </div>

        {/* Filter By */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Filter by</label>
          <div className="relative">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Select" disabled>Select</option>
              <option value="All">All Templates</option>
              <option value="Recent">Recently Used</option>
              <option value="Favorites">Favorites</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Frequently Used Section */}
      <div className="px-6 pb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Frequently Used</h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredTemplates.map((template, index) => (
            <div
              key={index}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors border border-blue-100"
              onClick={() => onTemplateSelect(template)}
            >
              <span className="text-sm font-medium text-gray-800">{template.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Patient Info (Optional - could be shown somewhere) */}
      <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Selected Patient: <span className="font-medium text-gray-700">{selectedPatient.name}</span>
        </div>
      </div>
    </div>
  );
} 