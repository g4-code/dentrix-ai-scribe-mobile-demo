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

export function VoiceAIWorkflow() {
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
    <div className="
      min-h-screen 
      w-full 
      bg-white 
      flex 
      flex-col 
      overflow-hidden
      mobile-scroll
      safe-area-inset-left
      safe-area-inset-right
    ">
      {/* Mobile-first responsive header */}
      <VoiceAIHeader
        title={getHeaderTitle()}
        onBack={getBackHandler()}
        showBackButton={shouldShowBackButton}
      />

      {/* Mobile-optimized scrollable content area */}
      <main className="
        flex-1 
        overflow-y-auto 
        mobile-scroll
        focus:outline-none
        scroll-smooth
        overscroll-contain
      ">
        {/* Mobile-first responsive container */}
        <div className="
          min-h-full
          px-4 
          py-4
          sm:px-5 
          sm:py-5
          md:px-6 
          md:py-6
          lg:px-8 
          lg:py-8
          max-w-full
          mx-auto
          md:max-w-4xl
          lg:max-w-6xl
        ">
          
          {/* Patient Selection View - Mobile First */}
          {currentView === 'patient-selection' && (
            <div className="
              w-full 
              space-y-4 
              sm:space-y-5 
              md:space-y-6
              animate-in 
              fade-in-0 
              slide-in-from-bottom-2 
              duration-300
            ">
              <PatientSelectionView onPatientSelect={handlePatientSelect} />
            </div>
          )}

          {/* Template Selection View - Mobile First */}
          {currentView === 'template-selection' && selectedPatient && (
            <div className="
              w-full 
              space-y-4 
              sm:space-y-5 
              md:space-y-6
              animate-in 
              fade-in-0 
              slide-in-from-right-2 
              duration-300
            ">
              <TemplateSelectionView
                selectedPatient={selectedPatient}
                onTemplateSelect={handleTemplateSelect}
              />
            </div>
          )}

          {/* Clinical Note View - Mobile First */}
          {currentView === 'clinical-note' && selectedPatient && selectedTemplate && (
            <div className="
              w-full 
              space-y-4 
              sm:space-y-5 
              md:space-y-6
              animate-in 
              fade-in-0 
              slide-in-from-right-2 
              duration-300
              pb-safe-area-inset-bottom
            ">
              <ClinicalNoteView
                selectedPatient={selectedPatient}
                selectedTemplate={selectedTemplate}
                onNavigateToSummary={handleNavigateToSummary}
              />
            </div>
          )}

          {/* Clinical Summary View - Mobile First */}
          {currentView === 'clinical-summary' && selectedPatient && selectedTemplate && (
            <div className="
              w-full 
              space-y-4 
              sm:space-y-5 
              md:space-y-6
              animate-in 
              fade-in-0 
              slide-in-from-right-2 
              duration-300
            ">
              <ClinicalSummaryView
                selectedPatient={selectedPatient}
                selectedTemplate={selectedTemplate}
                onNavigateToSuccess={handleNavigateToSuccess}
                onClose={() => {
                  setCurrentView('patient-selection');
                  setSelectedPatient(null);
                  setSelectedTemplate(null);
                }}
              />
            </div>
          )}

          {/* Success View - Mobile First */}
          {currentView === 'success' && (
            <div className="
              w-full 
              flex 
              flex-col 
              items-center 
              justify-center
              min-h-[60vh]
              space-y-6 
              sm:space-y-8 
              md:space-y-10
              text-center
              animate-in 
              fade-in-0 
              zoom-in-95 
              duration-500
            ">
              <SuccessView
                onStartNewRecording={handleStartNewRecording}
              />
            </div>
          )}

        </div>
        
        {/* Bottom safe area spacing for mobile devices */}
        <div className="safe-area-inset-bottom h-4 sm:h-6 md:h-8" />
        
      </main>
    </div>
  );
}