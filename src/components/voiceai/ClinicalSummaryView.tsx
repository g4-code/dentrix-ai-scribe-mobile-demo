"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, X, RefreshCw, Trash2, CheckCircle2, Sparkles } from "lucide-react";
import { Patient, Template, ChecklistItem } from "./types";

interface ClinicalSummaryViewProps {
  selectedPatient: Patient;
  selectedTemplate: Template;
  onNavigateToSuccess: () => void;
  onClose: () => void;
}

export function ClinicalSummaryView({ 
  selectedPatient, 
  selectedTemplate, 
  onNavigateToSuccess,
  onClose 
}: ClinicalSummaryViewProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'checklist'>('summary');
  const [transcriptData, setTranscriptData] = useState<string>("");
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);
  
  // AI Summary states
  const [clinicalSummary, setClinicalSummary] = useState<string>("");
  const [cleanedTranscript, setCleanedTranscript] = useState<string>("");
  const [isProcessingSummary, setIsProcessingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Generate clinical summary using AI
  const generateClinicalSummary = useCallback(async (transcript: string) => {
    if (!transcript.trim()) {
      console.log("⚠️ No transcript data to process");
      return;
    }

    setIsProcessingSummary(true);
    setSummaryError(null);
    console.log("🤖 Generating clinical summary with AI...");

    try {
      const response = await fetch('/api/clinical-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptText: transcript }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setClinicalSummary(result.clinicalSummary);
        setCleanedTranscript(result.cleanedTranscript);
        console.log("✅ Clinical summary generated successfully");
      } else {
        throw new Error(result.error || 'Failed to generate summary');
      }
    } catch (error) {
      console.error("❌ Error generating clinical summary:", error);
      setSummaryError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsProcessingSummary(false);
    }
  }, []);

  // Load transcript data and checklist data from localStorage
  useEffect(() => {
    const loadData = async () => {
      // Load transcript data
      const savedCaption = localStorage.getItem('clinical-caption-text');
      if (savedCaption) {
        setTranscriptData(savedCaption);
        console.log("📋 Loaded transcript data for summary view:", savedCaption);
        
        // Automatically generate AI summary when transcript data is available
        await generateClinicalSummary(savedCaption);
      }

      // Load checklist data
      const savedChecklist = localStorage.getItem('clinical-checklist-data');
      if (savedChecklist) {
        try {
          const parsedChecklist = JSON.parse(savedChecklist);
          // Convert detectedAt strings back to Date objects
          const checklistWithDates = parsedChecklist.map((item: ChecklistItem & { detectedAt?: string | Date }) => ({
            ...item,
            detectedAt: item.detectedAt ? new Date(item.detectedAt) : undefined
          }));
          setChecklistData(checklistWithDates);
          console.log("✅ Loaded checklist data for summary view:", checklistWithDates);
        } catch (error) {
          console.error("❌ Error parsing checklist data:", error);
          setChecklistData([]);
        }
      }
    };

    loadData();

    // Listen for storage changes (in case user records more audio or updates checklist)
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'clinical-caption-text') {
        await loadData();
        console.log("🔄 Data updated from localStorage");
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [generateClinicalSummary]);

  // Manual refresh function for transcript data
  const refreshTranscriptData = async () => {
    const savedCaption = localStorage.getItem('clinical-caption-text');
    setTranscriptData(savedCaption || "");
    console.log("🔄 Manually refreshed transcript data:", savedCaption);
    
    // Regenerate AI summary with refreshed data
    if (savedCaption) {
      await generateClinicalSummary(savedCaption);
    }
  };

  // Clear transcript and checklist data for testing
  const clearTranscriptData = () => {
    localStorage.removeItem('clinical-caption-text');
    localStorage.removeItem('clinical-checklist-data');
    setTranscriptData("");
    setChecklistData([]);
    setClinicalSummary("");
    setCleanedTranscript("");
    setSummaryError(null);
    console.log("🗑️ Cleared transcript and checklist data");
  };

  // Mock consultation data - this would come from actual data in real implementation
  const consultationDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '/');
  
  const consultationTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(':', '.');

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Patient Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-sm font-medium text-gray-600">
              {selectedPatient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h2>
            <p className="text-sm text-gray-600">{selectedTemplate.name}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Consultation Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold text-gray-900">
            Consultation {consultationDate} {consultationTime}
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="flex space-x-8 px-4">
          {(['summary', 'transcript', 'checklist'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-4 min-h-0">
        <div className="h-full overflow-y-auto">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Clinical Summary</h4>
              {isProcessingSummary && (
                <div className="flex items-center text-sm text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Processing with AI...
                </div>
              )}
            </div>
            
            {summaryError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-800 mb-2">
                  <span className="font-medium">Error generating summary:</span>
                </div>
                <div className="text-sm text-red-700">{summaryError}</div>
                <button 
                  onClick={() => generateClinicalSummary(transcriptData)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                  disabled={isProcessingSummary}
                >
                  Try Again
                </button>
              </div>
            ) : clinicalSummary ? (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {clinicalSummary}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  Generated by AI • {new Date().toLocaleString()}
                </div>
              </div>
            ) : !transcriptData ? (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">No transcript data available for summary generation.</p>
                <p className="text-sm text-gray-400 mt-2">Record some audio in the Clinical Note view first.</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">Preparing summary...</p>
                <p className="text-sm text-gray-400 mt-2">AI is processing your transcript data.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transcript' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Recording Transcript</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshTranscriptData}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Refresh transcript data"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={clearTranscriptData}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Clear transcript data"
                >
                  <Trash2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            {cleanedTranscript || transcriptData ? (
              <div className="space-y-4">
                {cleanedTranscript ? (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-xs font-medium text-blue-800 mb-2">AI-Cleaned Chat Transcript:</div>
                    <div className="text-sm text-blue-700 leading-relaxed space-y-2">
                      {cleanedTranscript.split('\n').map((line, index) => {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) return null;
                        
                        // Format chat-style messages
                        if (trimmedLine.startsWith('Doctor:')) {
                          return (
                            <div key={index} className="flex">
                              <div className="bg-blue-100 rounded-lg p-2 max-w-xs">
                                <div className="text-xs font-semibold text-blue-800 mb-1">Doctor</div>
                                <div className="text-blue-700">{trimmedLine.replace('Doctor:', '').trim()}</div>
                              </div>
                            </div>
                          );
                        } else if (trimmedLine.startsWith('Patient:')) {
                          return (
                            <div key={index} className="flex justify-end">
                              <div className="bg-white rounded-lg p-2 max-w-xs border border-blue-200">
                                <div className="text-xs font-semibold text-gray-600 mb-1">Patient</div>
                                <div className="text-gray-700">{trimmedLine.replace('Patient:', '').trim()}</div>
                              </div>
                            </div>
                          );
                        } else {
                          // Fallback for lines without clear speaker identification
                          return (
                            <div key={index} className="text-blue-700 whitespace-pre-wrap">
                              {trimmedLine}
                            </div>
                          );
                        }
                      }).filter(Boolean)}
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-600">
                      Processed by AI • Speakers identified, duplicates removed, spelling corrected
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="text-xs font-medium text-gray-600 mb-2">Original Transcript:</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {transcriptData}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
                      Processing with AI to clean and improve...
                    </div>
                  </div>
                )}
                
                {cleanedTranscript && transcriptData && cleanedTranscript !== transcriptData && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center">
                      <span className="mr-2">Show original transcript</span>
                      <svg className="w-4 h-4 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </summary>
                    <div className="mt-3 bg-gray-50 p-4 rounded-lg border">
                      <div className="text-xs font-medium text-gray-600 mb-2">Original (Raw) Transcript:</div>
                      <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {transcriptData}
                      </div>
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">No transcript available yet.</p>
                <p className="text-sm text-gray-400 mt-2">Record some audio in the Clinical Note view to see transcript data here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">Clinical Checklist</h4>
              <div className="text-sm text-gray-500">
                {checklistData.filter(item => item.selectedOption).length} of {checklistData.length} completed
              </div>
            </div>
            
            <div className="space-y-4">
              {checklistData.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    {/* Status Indicator */}
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-0.5 border-2 transition-all duration-300 ${
                      item.selectedOption
                        ? item.autoCompleted
                          ? 'border-emerald-400 bg-emerald-500'
                          : 'border-blue-400 bg-blue-500'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                      {item.selectedOption && (
                        <div className="w-full h-full rounded-full flex items-center justify-center">
                          {item.autoCompleted ? (
                            <Sparkles className="w-3 h-3 text-white" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          {item.title}
                        </h5>
                        {item.autoCompleted && item.detectedAt && (
                          <div className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                            AI Detected
                          </div>
                        )}
                      </div>

                      {/* Selected Option Display */}
                      {item.selectedOption ? (
                        <div className="space-y-2">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.autoCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.selectedOption}
                          </div>
                          
                          {item.detectedAt && (
                            <div className="text-xs text-gray-500">
                              {item.autoCompleted ? 'Auto-detected' : 'Manually selected'} at{' '}
                              {item.detectedAt instanceof Date 
                                ? item.detectedAt.toLocaleTimeString() 
                                : new Date(item.detectedAt).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Not completed
                        </div>
                      )}

                      {/* Available Options (collapsed) */}
                      <details className="mt-3 group">
                        <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 flex items-center">
                          <span className="mr-1">Available options</span>
                          <svg className="w-3 h-3 transform group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </summary>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.options.map((option) => (
                            <span
                              key={option}
                              className={`text-xs px-2 py-1 rounded-full border ${
                                option === item.selectedOption
                                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-600'
                              }`}
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Completed Items</div>
                  <div className="font-semibold text-gray-900">
                    {checklistData.filter(item => item.selectedOption).length} / {checklistData.length}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">AI Auto-completed</div>
                  <div className="font-semibold text-emerald-600">
                    {checklistData.filter(item => item.autoCompleted).length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 mt-auto">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 py-3 text-base font-medium"
            onClick={() => generateClinicalSummary(transcriptData)}
            disabled={isProcessingSummary || !transcriptData}
          >
            {isProcessingSummary ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                PROCESSING...
              </>
            ) : (
              'REGENERATE'
            )}
          </Button>
          <Button 
            className="flex-1 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700"
            disabled={isProcessingSummary}
            onClick={onNavigateToSuccess}
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
} 