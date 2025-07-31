"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Activity, CheckCircle } from "lucide-react";
import type { ClinicalFinding } from "../types";

interface TranscriptionDisplayProps {
  caption?: string;
  isRecording: boolean;
  isConnected: boolean;
  connectionHealth?: 'healthy' | 'warning' | 'reconnecting' | 'failed';
  silenceWarning?: boolean;
  detectedFindings?: ClinicalFinding[];
  isAnalyzing?: boolean;
}

export function TranscriptionDisplay({ 
  caption, 
  isRecording, 
  isConnected, 
  connectionHealth = 'healthy',
  silenceWarning = false,
  detectedFindings = [],
  isAnalyzing = false
}: TranscriptionDisplayProps) {
  const [recentFindings, setRecentFindings] = useState<ClinicalFinding[]>([]);
  const [showProcessingPulse, setShowProcessingPulse] = useState(false);

  // Track recent findings for highlighting
  useEffect(() => {
    if (detectedFindings.length > recentFindings.length) {
      setRecentFindings(detectedFindings);
      
      // Show processing pulse for new findings
      setShowProcessingPulse(true);
      setTimeout(() => setShowProcessingPulse(false), 2000);
    }
  }, [detectedFindings, recentFindings.length]);

  // Function to highlight clinical phrases in the transcript
  const highlightClinicalPhrases = (text: string): React.JSX.Element => {
    if (!text || detectedFindings.length === 0) {
      return <span>{text}</span>;
    }

    const highlightedText = text;
    const highlights: Array<{ start: number; end: number; finding: ClinicalFinding }> = [];

    // Find all clinical phrases in the text
    detectedFindings.forEach(finding => {
      const sourceText = finding.sourceText.toLowerCase();
      const textLower = highlightedText.toLowerCase();
      const index = textLower.indexOf(sourceText);
      
      if (index !== -1) {
        highlights.push({
          start: index,
          end: index + sourceText.length,
          finding
        });
      }
    });

    // Sort highlights by position
    highlights.sort((a, b) => a.start - b.start);

    if (highlights.length === 0) {
      return <span>{text}</span>;
    }

    const elements: React.JSX.Element[] = [];
    let lastEnd = 0;

    highlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastEnd) {
        elements.push(
          <span key={`text-${index}`}>
            {text.substring(lastEnd, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      elements.push(
        <span
          key={`highlight-${index}`}
          className="bg-emerald-200 text-emerald-900 px-1 py-0.5 rounded-sm font-medium animate-pulse"
          title={`Detected: ${highlight.finding.detectedValue} (${Math.round(highlight.finding.confidence * 100)}% confidence)`}
        >
          {text.substring(highlight.start, highlight.end)}
        </span>
      );

      lastEnd = highlight.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
      elements.push(
        <span key="text-end">
          {text.substring(lastEnd)}
        </span>
      );
    }

    return <>{elements}</>;
  };
  // Connection health indicators
  const getConnectionHealthColor = () => {
    switch (connectionHealth) {
      case 'healthy': return 'bg-green-100 border-green-200';
      case 'warning': return 'bg-yellow-100 border-yellow-200';
      case 'reconnecting': return 'bg-blue-100 border-blue-200';
      case 'failed': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getConnectionHealthIcon = () => {
    switch (connectionHealth) {
      case 'healthy': return '🟢';
      case 'warning': return '⚠️';
      case 'reconnecting': return '🔄';
      case 'failed': return '❌';
      default: return '⚪';
    }
  };

  if (!isConnected && !caption) {
    return (
      <div className={`p-4 rounded-lg border ${getConnectionHealthColor()}`}>
        <div className="flex items-center space-x-2">
          <span>{getConnectionHealthIcon()}</span>
          <p className="text-sm text-gray-500">
            {connectionHealth === 'reconnecting' ? 'Reconnecting to speech service...' : 'Connecting to speech service...'}
          </p>
        </div>
      </div>
    );
  }

  if (!caption || caption.trim() === "") {
    return (
      <div className={`p-4 rounded-lg border ${getConnectionHealthColor()}`}>
        <div className="flex items-center space-x-2">
          <span>{getConnectionHealthIcon()}</span>
          <p className="text-sm text-gray-500">
            {isRecording ? "Listening..." : "Ready to record"}
          </p>
          {silenceWarning && isRecording && (
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              ⏰ Silence detected - speak soon to maintain connection
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${
      connectionHealth === 'healthy' ? 'bg-blue-50 border-blue-200' : getConnectionHealthColor()
    } ${showProcessingPulse ? 'ring-2 ring-emerald-300 ring-opacity-75' : ''}`}>
      
      {/* Enhanced header with clinical analysis indicators */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isRecording && (
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
          <span className="text-xs">{getConnectionHealthIcon()}</span>
          <span className="text-xs text-gray-600 font-medium">
            {isRecording ? "Live Recording" : "Ready to Record"}
          </span>
        </div>

        {/* Clinical findings counter */}
        <div className="flex items-center space-x-3">
          {isAnalyzing && (
            <div className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse">
              <Activity className="w-3 h-3" />
              <span>Analyzing...</span>
            </div>
          )}
          
          {detectedFindings.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
              <Sparkles className="w-3 h-3" />
              <span>{detectedFindings.length} finding{detectedFindings.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced transcript with clinical phrase highlighting */}
      <div className="flex items-start space-x-2">
        <div className="flex-1">
          <div className="text-sm text-gray-800 leading-relaxed min-h-[1.5rem]">
            {caption ? highlightClinicalPhrases(caption) : (
              <span className="text-gray-500 italic">
                {isRecording ? "Listening for speech..." : "Click record to start"}
              </span>
            )}
          </div>
          
          {/* Enhanced silence warning */}
          {silenceWarning && isRecording && (
            <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 border border-yellow-200 px-3 py-2 rounded-md flex items-center space-x-2 animate-pulse">
              <span>⏰</span>
              <span>Silence detected - speak soon to maintain connection</span>
            </div>
          )}

          {/* Recent findings display */}
          {detectedFindings.length > 0 && (
            <div className="mt-3 space-y-1">
              <div className="text-xs font-medium text-gray-600 mb-2">Recent Clinical Findings:</div>
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {detectedFindings.slice(-3).map((finding, index) => (
                  <div 
                    key={`${finding.checklistItemId}-${index}`}
                    className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 rounded px-2 py-1 animate-fade-in"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-800 font-medium">
                        {finding.detectedValue}
                      </span>
                    </div>
                    <div className="text-emerald-600">
                      {Math.round(finding.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 