"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient, ChecklistItem, ClinicalFinding } from "./types";
import { useVoiceTranscription } from "./hooks/useVoiceTranscription";
import { TranscriptionDisplay } from "./components/TranscriptionDisplay";
import { MicrophoneState } from "../../app/context/MicrophoneContextProvider";

interface ClinicalNoteViewProps {
  selectedPatient: Patient;
  selectedTemplate: { name: string };
  onNavigateToSummary: () => void;
}

export function ClinicalNoteView({ selectedPatient, selectedTemplate, onNavigateToSummary }: ClinicalNoteViewProps) {
  // selectedTemplate is passed but not currently used in this component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unused = selectedTemplate;
  // Clinical findings auto-completion callback
  const handleClinicalFindingDetected = useCallback((finding: ClinicalFinding) => {
    console.log("🔍 Clinical finding detected in UI:", finding.checklistItemId, "→", finding.detectedValue);
    
    setChecklistData(prev => 
      prev.map(item => {
        if (item.id === finding.checklistItemId) {
          // Only auto-complete if not already manually selected
          if (!item.selectedOption || item.autoCompleted) {
            console.log("✅ Auto-completing checklist item:", item.id, "→", finding.detectedValue);
            return { 
              ...item, 
              selectedOption: finding.detectedValue,
              autoCompleted: true,
              detectedAt: finding.detectedAt
            };
          } else {
            console.log("🔄 Skipping auto-completion - item already manually selected:", item.id);
          }
        }
        return item;
      })
    );
  }, []);

  const { 
    caption, 
    isRecording, 
    isConnected, 
    startRecording, 
    stopRecording,
    microphoneState,
    connectionHealth,
    silenceWarning,
    // 🆕 Clinical analysis integration
    detectedFindings
  } = useVoiceTranscription(handleClinicalFindingDetected);

  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([
    {
      id: "overall-oral-hygiene",
      title: "Patient overall oral hygiene",
      options: ["Excellent", "Normal", "Poor"],
    },
    {
      id: "oral-hygiene-calculus",
      title: "Oral hygiene exam calculus",
      options: ["Excellent", "Good", "Fair", "Poor"],
    },
    {
      id: "oral-hygiene-stain",
      title: "Oral hygiene exam of stain",
      options: ["None", "Light", "Moderate", "Heavy"],
    },
    {
      id: "oral-hygiene-food-impaction",
      title: "Oral hygiene exam of food impaction",
      options: ["None", "Light", "Moderate", "Heavy"],
    },
    {
      id: "plaque-accumulation",
      title: "Plaque accumulation",
      options: ["None", "Minimal", "Moderate", "Heavy"],
    },
    {
      id: "gingival-inflammation",
      title: "Gingival inflammation",
      options: ["None", "Mild", "Moderate", "Severe"],
    },
    {
      id: "periodontal-pockets",
      title: "Periodontal pockets",
      options: ["Normal", "3-4mm", "5-6mm", "7mm+"],
    },
  ]);

  // Track if user has recorded at least once
  const [hasRecorded, setHasRecorded] = useState(false);

  // 📝 Caption text storage for prototyping
  const [accumulatedCaption, setAccumulatedCaption] = useState("");
  const currentSessionCaption = useRef("");
  const [debugCurrentSession, setDebugCurrentSession] = useState(""); // For live debug display
  const isCurrentlyRecording = useRef(false);
  const previousIsRecording = useRef(false);

  // Enhanced option selection with manual vs auto tracking
  const handleOptionSelect = useCallback((itemId: string, option: string) => {
    console.log("👤 Manual selection:", itemId, "→", option);
    
    setChecklistData(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              selectedOption: option,
              autoCompleted: false, // Mark as manually selected
              detectedAt: new Date() // Timestamp for manual selection
            }
          : item
      )
    );
  }, []);

  // Undo auto-completion function
  const handleUndoAutoComplete = useCallback((itemId: string) => {
    console.log("↩️ Undoing auto-completion for:", itemId);
    
    setChecklistData(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              selectedOption: undefined,
              autoCompleted: false,
              detectedAt: undefined
            }
          : item
      )
    );
  }, []);

  // 📝 Clear localStorage on page refresh/mount for fresh sessions
  useEffect(() => {
    console.log("🔄 Page loaded - clearing previous session data for fresh start");
    localStorage.removeItem('clinical-caption-text');
    setAccumulatedCaption("");
    console.log("🗑️ Cleared localStorage on page refresh");

    // Also clear localStorage when user closes tab or navigates away
    const handleBeforeUnload = () => {
      localStorage.removeItem('clinical-caption-text');
      console.log("🗑️ Cleared localStorage on page unload");
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 📝 Track recording state changes and caption accumulation
  useEffect(() => {
    // Update refs to track current state
    isCurrentlyRecording.current = isRecording;
    
    // Detect when recording starts (was not recording, now recording)
    if (!previousIsRecording.current && isRecording) {
      console.log("🎤 Recording started! Resetting session caption...");
      currentSessionCaption.current = "";
      setDebugCurrentSession("");
    }
    
    // Detect when recording stops (was recording, now not recording)
    if (previousIsRecording.current && !isRecording) {
      console.log("🛑 Recording stopped! Processing accumulated text...");
      console.log("🔍 Raw currentSessionCaption.current:", JSON.stringify(currentSessionCaption.current));
      console.log("🔍 Current caption variable:", JSON.stringify(caption));
      
      // Get final caption text from current session
      const finalSessionText = currentSessionCaption.current.trim();
      
      // Filter out debug messages and non-speech content
      const isValidSpeechContent = finalSessionText && 
        !finalSessionText.includes("Stopping recording") &&
        !finalSessionText.includes("Ready to record") &&
        !finalSessionText.includes("Powered by Deepgram") &&
        finalSessionText.length > 3; // Minimum length for meaningful content
      
      if (isValidSpeechContent) {
        console.log("📝 Valid speech content found:", finalSessionText);
        
        // Append to accumulated caption with timestamp
        const timestamp = new Date().toLocaleTimeString();
        const sessionEntry = `[${timestamp}] ${finalSessionText}`;
        
        setAccumulatedCaption(prev => {
          const newAccumulated = prev 
            ? `${prev}\n\n${sessionEntry}` 
            : sessionEntry;
          
          // Save to localStorage
          localStorage.setItem('clinical-caption-text', newAccumulated);
          console.log("💾 Saved accumulated caption to storage:", newAccumulated);
          
          return newAccumulated;
        });
      } else {
        console.log("⚠️ No valid speech content to save. Content was:", JSON.stringify(finalSessionText));
        console.log("🔍 Debug session state:", JSON.stringify(debugCurrentSession));
        
        // Check if we have any valid content in debug state (fallback)
        const fallbackText = debugCurrentSession.trim();
        const isFallbackValid = fallbackText && 
          !fallbackText.includes("Stopping recording") &&
          !fallbackText.includes("Ready to record") &&
          !fallbackText.includes("Powered by Deepgram") &&
          fallbackText.length > 3;
          
        if (isFallbackValid) {
          console.log("✅ Found valid content in debug state:", fallbackText);
          const timestamp = new Date().toLocaleTimeString();
          const sessionEntry = `[${timestamp}] ${fallbackText}`;
          
          setAccumulatedCaption(prev => {
            const newAccumulated = prev 
              ? `${prev}\n\n${sessionEntry}` 
              : sessionEntry;
            
            localStorage.setItem('clinical-caption-text', newAccumulated);
            console.log("💾 Saved fallback content to storage:", newAccumulated);
            
            return newAccumulated;
          });
        } else {
          // Still save a debug entry to show that recording happened
          const timestamp = new Date().toLocaleTimeString();
          const debugEntry = `[${timestamp}] Recording session completed - no speech detected`;
          
          setAccumulatedCaption(prev => {
            const newAccumulated = prev 
              ? `${prev}\n\n${debugEntry}` 
              : debugEntry;
            
            localStorage.setItem('clinical-caption-text', newAccumulated);
            console.log("💾 Saved debug entry to storage:", newAccumulated);
            
            return newAccumulated;
          });
        }
      }
      
      // Reset current session
      currentSessionCaption.current = "";
      setDebugCurrentSession("");
    }
    
    // Update previous state for next comparison
    previousIsRecording.current = isRecording;
  }, [isRecording, caption, debugCurrentSession]);

  // 📝 Track caption changes during recording
  useEffect(() => {
    if (isRecording && caption) {
      // Filter out debug messages and only capture actual speech content
      const isValidCaption = caption && 
        !caption.includes("Stopping recording") &&
        !caption.includes("Ready to record") &&
        !caption.includes("Powered by Deepgram") &&
        caption.trim().length > 0;
        
      if (isValidCaption) {
        console.log("📝 Capturing valid caption chunk:", JSON.stringify(caption));
        
        // Accumulate text instead of replacing it
        const trimmedCaption = caption.trim();
        const currentText = currentSessionCaption.current.trim();
        
        // Improved deduplication for Deepgram interim results
        const shouldUpdate = () => {
          // If no current text, use the new caption
          if (!currentText) {
            return { action: 'replace', text: trimmedCaption };
          }
          
          // If new caption is longer and contains the current text, it's likely an expansion
          if (trimmedCaption.length > currentText.length && trimmedCaption.includes(currentText)) {
            return { action: 'replace', text: trimmedCaption };
          }
          
          // If new caption is completely different and doesn't overlap significantly, append it
          const words1 = currentText.toLowerCase().split(' ').filter(w => w.length > 2);
          const words2 = trimmedCaption.toLowerCase().split(' ').filter(w => w.length > 2);
          const commonWords = words1.filter(word => words2.includes(word));
          const overlapRatio = commonWords.length / Math.max(words1.length, words2.length);
          
          // If less than 30% overlap, it's likely new content
          if (overlapRatio < 0.3 && trimmedCaption !== currentText) {
            return { action: 'append', text: `${currentText} ${trimmedCaption}` };
          }
          
          // If it's the same or very similar, skip it
          if (trimmedCaption === currentText || currentText.includes(trimmedCaption)) {
            return { action: 'skip', text: currentText };
          }
          
          // Default: replace if the new text is longer
          if (trimmedCaption.length > currentText.length) {
            return { action: 'replace', text: trimmedCaption };
          }
          
          return { action: 'skip', text: currentText };
        };
        
        const decision = shouldUpdate();
        
        switch (decision.action) {
          case 'replace':
            currentSessionCaption.current = decision.text;
            setDebugCurrentSession(decision.text);
            console.log("🔗 Replaced session text:", JSON.stringify(decision.text));
            break;
          case 'append':
            currentSessionCaption.current = decision.text;
            setDebugCurrentSession(decision.text);
            console.log("🔗 Appended new text:", JSON.stringify(decision.text));
            break;
          case 'skip':
            console.log("🔄 Skipping duplicate/similar content:", JSON.stringify(trimmedCaption));
            break;
        }
      } else {
        console.log("🔍 Ignoring debug caption:", JSON.stringify(caption));
      }
    }
  }, [caption, isRecording]);

  // 🧪 Debug function to clear accumulated caption (for testing)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clearAccumulatedCaption = useCallback(() => {
    setAccumulatedCaption("");
    localStorage.removeItem('clinical-caption-text');
    console.log("🗑️ Cleared accumulated caption from storage");
  }, []);

  // 🧪 Debug: Log accumulated caption when it changes
  useEffect(() => {
    if (accumulatedCaption) {
      console.log("📚 Total accumulated caption:", accumulatedCaption);
    }
  }, [accumulatedCaption]);

  return (
    <>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s ease-out;
        }
      `}</style>
      <div className="flex-1 flex flex-col min-h-full pb-20">
      {/* Mobile-optimized patient header */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center space-x-4 sm:space-x-5">
          <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-base sm:text-lg font-semibold text-gray-600 mobile-subtitle">
              {selectedPatient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 truncate mobile-title">
              {selectedPatient.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 truncate mobile-body mt-1">
              {selectedPatient.status}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-optimized recording button */}
      <div className="px-4 py-8 sm:px-6 sm:py-10 flex justify-center">
        <Button
          className={`
            w-28 
            h-28 
            sm:w-32 
            sm:h-32 
            md:w-36 
            md:h-36
            rounded-full 
            border-none 
            shadow-xl 
            hover:shadow-2xl
            mobile-button-enhanced
            mobile-touch-enhanced
            mobile-focus-ring
            mobile-performance-optimized
            mobile-tap-large
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${isRecording ? 'mobile-recording-pulse' : ''}
            ${microphoneState === MicrophoneState.SettingUp ? 'mobile-loading-pulse' : ''}
          `}
          style={{
            background: isRecording 
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)'
              : microphoneState === MicrophoneState.SettingUp
              ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 50%, #4B5563 100%)'
              : 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 50%, #1E40AF 100%)',
          }}
          onClick={() => {
            console.log('Button clicked! isRecording:', isRecording, 'isConnected:', isConnected);
            if (isRecording) {
              stopRecording();
              console.log('Stop recording for patient:', selectedPatient.name);
            } else {
              startRecording();
              setHasRecorded(true); // Mark that user has recorded at least once
              console.log('Start recording for patient:', selectedPatient.name);
            }
          }}
          disabled={microphoneState === MicrophoneState.SettingUp}
          aria-label={
            microphoneState === MicrophoneState.SettingUp 
              ? "Setting up microphone..." 
              : isRecording 
                ? "Stop recording" 
                : "Start recording"
          }
        >
          {isRecording ? (
            <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          ) : (
            <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          )}
        </Button>
      </div>

      {/* Mobile-optimized view summary button */}
      {hasRecorded && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 flex justify-center">
          <Button
            onClick={() => {
              // Save checklist data to localStorage for ClinicalSummaryView
              localStorage.setItem('clinical-checklist-data', JSON.stringify(checklistData));
              console.log("💾 Saved checklist data to localStorage for summary view");
              onNavigateToSummary();
            }}
            className="
              bg-green-600 
              hover:bg-green-700 
              active:bg-green-800
              text-white 
              px-6 
              py-3 
              sm:px-8 
              sm:py-4
              rounded-lg 
              sm:rounded-xl
              font-semibold 
              shadow-lg 
              hover:shadow-xl
              mobile-button-enhanced
              mobile-touch-enhanced
              mobile-focus-ring
              mobile-performance-optimized
              mobile-thumb-zone
              mobile-slide-up
              text-base
              sm:text-lg
            "
            aria-label="View clinical summary"
          >
            View Summary
          </Button>
        </div>
      )}

      {/* Mobile-optimized transcription display */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-6">
        <TranscriptionDisplay 
          caption={caption}
          isRecording={isRecording}
          isConnected={isConnected}
          connectionHealth={connectionHealth}
          silenceWarning={silenceWarning}
          detectedFindings={detectedFindings}
          isAnalyzing={false} // Could be enhanced with actual analyzing state
        />
      </div>
    

      {/* 🧪 Debug: Show accumulated text during recording */}
      {process.env.NODE_ENV === 'development' && isRecording && (
        <div className="mx-4 mb-4 sm:mx-6 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl">
          <div className="text-xs sm:text-sm font-semibold text-blue-800 mb-2 mobile-body">📝 Session Text (Live Debug)</div>
          <div className="text-sm sm:text-base text-blue-700 bg-white p-3 rounded border max-h-24 sm:max-h-32 overflow-y-auto mobile-scroll mobile-body">
            {debugCurrentSession || "Listening... speak to see text appear here"}
          </div>
        </div>
      )}



      {/* Mobile-optimized clinical note checklist */}
      <div className="flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Clinical Note Checklist
        </h3>
        
        <div className="space-y-8 max-h-96 sm:max-h-[500px] overflow-y-auto mobile-scroll">
          {checklistData.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              {/* Status indicator */}
              <div className={`w-6 h-6 rounded-full flex-shrink-0 border-2 flex items-center justify-center mt-1 ${
                item.selectedOption
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-400 border-dashed'
              }`}>
                {item.selectedOption && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Title and AI indicator */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h4>
                  {item.selectedOption && item.autoCompleted && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Selected
                      </span>
                      <button
                        onClick={() => handleUndoAutoComplete(item.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Undo
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Options with left border */}
                <div className="border-l-2 border-gray-300 pl-6 space-y-3">
                  {item.options.map((option) => {
                    const isSelected = item.selectedOption === option;
                    const isAutoSelected = isSelected && item.autoCompleted;
                    
                    return (
                      <label
                        key={option}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={item.id}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(item.id, option)}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className={`text-lg ${
                          isSelected 
                            ? 'font-bold text-gray-900' 
                            : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                        {isAutoSelected && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-emerald-600 bg-emerald-200 px-2 py-1 rounded-full">
                              Detected from speech
                            </span>
                            {(() => {
                              const finding = detectedFindings.find(f => 
                                f.checklistItemId === item.id && f.detectedValue === option
                              );
                              return finding ? (
                                <div className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded font-mono">
                                  {Math.round(finding.confidence * 100)}%
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
} 