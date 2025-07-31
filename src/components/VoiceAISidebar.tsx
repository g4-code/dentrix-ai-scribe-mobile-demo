"use client";

import { useState } from "react";
import { 
  VoiceAIHeader, 
  PatientSelectionView, 
  TemplateSelectionView,
  ClinicalNoteView,
  ClinicalSummaryView,
  SuccessView,
  Patient, 
  Template, 
  ViewType 
} from "./voiceai";
import PulseWave from "@/app/components/PulseWave";
import BackIcon from "./icons/BackIcon";
import MenuIcon from "./icons/MenuIcon";
import RecordButton from "./record/RecordButton";

interface VoiceAISidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAISidebar({ isOpen, onClose }: VoiceAISidebarProps) {
  const [currentView, setCurrentView] = useState<ViewType>('patient-selection');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('template-selection');
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentView('clinical-note');
  };

  const handleBackToTemplateSelection = () => {
    setCurrentView('template-selection');
    setSelectedTemplate(null);
  };

  const handleBackToPatientSelection = () => {
    setCurrentView('patient-selection');
    setSelectedPatient(null);
    setSelectedTemplate(null);
  };

  const handleNavigateToSummary = () => {
    setCurrentView('clinical-summary');
  };

  const handleNavigateToSuccess = () => {
    setCurrentView('success');
  };

  const handleBackToClinicalNote = () => {
    setCurrentView('clinical-note');
  };

  const handleStartNewRecording = () => {
    // Clear all data for fresh session
    localStorage.removeItem('clinical-caption-text');
    localStorage.removeItem('clinical-checklist-data');
    
    // Reset all state
    setCurrentView('patient-selection');
    setSelectedPatient(null);
    setSelectedTemplate(null);
    
    console.log("🔄 Started fresh recording session - all data cleared");
  };

  const handleClose = () => {
    setCurrentView('patient-selection');
    setSelectedPatient(null);
    setSelectedTemplate(null);
    onClose();
  };

  if (!isOpen) return null;

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'template-selection':
        return 'Select Template';
      case 'clinical-note':
        return selectedTemplate?.name || 'Clinical Note';
      case 'clinical-summary':
        return 'Clinical Summary';
      case 'success':
        return 'Success';
      default:
        return 'Voice AI';
    }
  };

  const getBackHandler = () => {
    switch (currentView) {
      case 'template-selection':
        return handleBackToPatientSelection;
      case 'clinical-note':
        return handleBackToTemplateSelection;
      case 'clinical-summary':
        return handleBackToClinicalNote;
      default:
        return undefined;
    }
  };

  const shouldShowBackButton = currentView !== 'patient-selection';

  return (
    <div 
      className={`fixed right-0 w-2/5 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ 
        top: '56px',
        height: 'calc(100vh - 56px)' // Ajustado para coincidir con el top
      }}
    >
      <div className="flex justify-right items-center p-4 gap-4 flex-shrink-0">
        <MenuIcon />
        <BackIcon />
      </div>
      <VoiceAIHeader
        title={getHeaderTitle()}
        onClose={handleClose}
        onBack={getBackHandler()}
        showBackButton={shouldShowBackButton}
      />

      <div className="flex-1 overflow-y-auto">
        {currentView === 'patient-selection' && (
          <PatientSelectionView onPatientSelect={handlePatientSelect} />
        )}

        {currentView === 'template-selection' && selectedPatient && (
          <TemplateSelectionView
            selectedPatient={selectedPatient}
            onTemplateSelect={handleTemplateSelect}
          />
        )}

        {currentView === 'clinical-note' && selectedPatient && selectedTemplate && (
          <ClinicalNoteView
            selectedPatient={selectedPatient}
            selectedTemplate={selectedTemplate}
            onNavigateToSummary={handleNavigateToSummary}
          />
        )}

        {currentView === 'clinical-summary' && selectedPatient && selectedTemplate && (
          <ClinicalSummaryView
            selectedPatient={selectedPatient}
            selectedTemplate={selectedTemplate}
            onNavigateToSuccess={handleNavigateToSuccess}
            onClose={handleClose}
          />
        )}

        {currentView === 'success' && (
          <SuccessView
            onStartNewRecording={handleStartNewRecording}
          />
        )}
      </div>
    </div>
  );
} 