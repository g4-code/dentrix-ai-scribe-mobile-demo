"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { ClinicalFinding, ClinicalAnalysisState } from "../types";
import { getAllPatternMatches } from "../clinicalPatterns";

/**
 * Return interface for the clinical analysis custom hook
 * @interface UseClinicalAnalysisReturn
 */
export interface UseClinicalAnalysisReturn {
  /** Main function to analyze transcript text for clinical findings */
  analyzeTranscript: (text: string, isFinal: boolean) => void;
  /** Array of all detected clinical findings */
  detectedFindings: ClinicalFinding[];
  /** Function to clear all detected findings */
  clearFindings: () => void;
  /** Boolean indicating if analysis is currently processing */
  isAnalyzing: boolean;
  /** Current analysis state for debugging and monitoring */
  analysisState: ClinicalAnalysisState;
  /** Error state for graceful degradation */
  hasError: boolean;
  /** Function to retry analysis after error */
  retryAnalysis: () => void;
}

/**
 * Custom hook for real-time clinical finding analysis from speech transcripts
 * 
 * This hook provides intelligent pattern matching for clinical speech-to-text,
 * automatically detecting clinical findings and auto-completing checklist items.
 * Follows .cursorrules architecture patterns for business logic extraction.
 * 
 * Features:
 * - Real-time pattern matching with debouncing for performance
 * - Memoized expensive computations for optimal re-render cycles
 * - Comprehensive error handling with graceful degradation
 * - Memory-efficient caching with automatic cleanup
 * - Production-ready error boundaries and fallback modes
 * 
 * @returns {UseClinicalAnalysisReturn} Hook interface with analysis functions and state
 * 
 * @example
 * ```typescript
 * const { 
 *   analyzeTranscript, 
 *   detectedFindings, 
 *   hasError, 
 *   retryAnalysis 
 * } = useClinicalAnalysis();
 * 
 * // Analyze transcript text
 * analyzeTranscript("patient has light gingival inflammation", true);
 * 
 * // Handle errors gracefully
 * if (hasError) {
 *   retryAnalysis();
 * }
 * ```
 */
export function useClinicalAnalysis(): UseClinicalAnalysisReturn {
  // Core state management following .cursorrules patterns
  const [detectedFindings, setDetectedFindings] = useState<ClinicalFinding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [analysisState, setAnalysisState] = useState<ClinicalAnalysisState>({
    isAnalyzing: false,
    lastProcessedText: '',
    detectedFindings: []
  });

  // Refs for performance optimization and cleanup
  const debounceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const processedTexts = useRef<Set<string>>(new Set());
  const findingHistory = useRef<Map<string, ClinicalFinding>>(new Map());
  
  // Configuration constants (memoized for performance)
  const config = useMemo(() => ({
    DEBOUNCE_DELAY: 300, // ms - debounce delay for performance optimization
    MAX_PROCESSED_TEXTS: 100, // Limit memory usage and prevent cache bloat
    CONFIDENCE_THRESHOLD: 0.5, // Minimum confidence score for valid findings
    MAX_FINDING_HISTORY: 200 // Maximum findings to keep in history cache
  }), []);

  /**
   * Helper function to calculate confidence score based on match quality
   * @param matchLength - Length of the matched text
   * @param patternLength - Length of the original pattern
   * @param contextLength - Length of the surrounding context
   * @returns Confidence score between 0-1
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateConfidence = useCallback((
    matchLength: number, 
    patternLength: number, 
    contextLength: number
  ): number => {
    // Base confidence from match length relative to pattern
    const matchRatio = matchLength / patternLength;
    let confidence = Math.min(0.95, matchRatio * 0.7 + 0.3);
    
    // Boost confidence for longer matches (more specific)
    if (matchLength > 15) {
      confidence += 0.1;
    }
    
    // Reduce confidence for very short context
    if (contextLength < 20) {
      confidence *= 0.9;
    }
    
    return Math.max(0.1, Math.min(0.95, confidence));
  }, []);

  /**
   * Memoized helper function to deduplicate findings based on similar content and timing
   * Uses efficient Set-based lookups and Map caching for optimal performance
   * 
   * @param {ClinicalFinding[]} newFindings - Array of new findings to check for duplicates
   * @param {ClinicalFinding[]} existingFindings - Array of existing findings to compare against
   * @returns {ClinicalFinding[]} Filtered array of unique findings with highest confidence scores
   * 
   * @performance Optimized with Set-based lookups (O(1)) instead of array searches (O(n))
   */
  const deduplicateFindings = useCallback((
    newFindings: ClinicalFinding[], 
    existingFindings: ClinicalFinding[]
  ): ClinicalFinding[] => {
    // Early return for empty arrays
    if (newFindings.length === 0) return [];
    if (existingFindings.length === 0) return newFindings;
    
    console.log("🔍 [Performance] Deduplicating findings - New:", newFindings.length, "Existing:", existingFindings.length);
    
    // Use Map for O(1) lookups instead of O(n) array searches
    const existingMap = new Map<string, ClinicalFinding>();
    existingFindings.forEach(finding => {
      const key = `${finding.checklistItemId}-${finding.detectedValue}`;
      existingMap.set(key, finding);
    });
    
    const uniqueFindings: ClinicalFinding[] = [];
    
    for (const finding of newFindings) {
      const findingKey = `${finding.checklistItemId}-${finding.detectedValue}`;
      const existingFinding = existingMap.get(findingKey);
      
      if (!existingFinding) {
        // New unique finding
        uniqueFindings.push(finding);
        console.log("✨ [Performance] Adding new finding:", findingKey);
      } else if (finding.confidence > existingFinding.confidence) {
        // Replace with higher confidence finding
        uniqueFindings.push(finding);
        console.log("📊 [Performance] Replacing with higher confidence:", 
          finding.confidence.toFixed(2), ">", existingFinding.confidence.toFixed(2));
      } else {
        console.log("🔄 [Performance] Skipping lower confidence duplicate:", findingKey);
      }
    }
    
    console.log("✅ [Performance] Deduplication complete - Unique findings:", uniqueFindings.length);
    return uniqueFindings;
  }, []);

    /**
   * Optimized core pattern matching logic using the clinical patterns database
   * Uses memoization and efficient filtering for high-performance real-time analysis
   * 
   * @param {string} text - Transcript text to analyze for clinical patterns
   * @returns {ClinicalFinding[]} Array of detected clinical findings with confidence scores
   * 
   * @performance
   * - Memoized with useCallback for stable references
   * - Early returns for invalid input
   * - Efficient confidence filtering
   * - Comprehensive error boundaries
   * 
   * @example
   * ```typescript
   * const findings = findPatternMatches("patient has light gingival inflammation");
   * // Returns: [{ checklistItemId: "gingival-inflammation", detectedValue: "Mild", confidence: 0.85, ... }]
   * ```
   */
  const findPatternMatches = useCallback((text: string): ClinicalFinding[] => {
    const startTime = performance.now();
    console.log("🔍 [Performance] Starting pattern matching for text:", JSON.stringify(text.substring(0, 50) + "..."));
    
    // Early validation with performance optimization
    const normalizedText = text.toLowerCase().trim();
    if (normalizedText.length < 3) {
      console.log("⚠️ [Performance] Text too short for analysis:", normalizedText.length);
      return [];
    }

    const findings: ClinicalFinding[] = [];

    try {
      // Use optimized helper function from clinicalPatterns
      const patternMatches = getAllPatternMatches(text);
      console.log(`🔍 [Performance] Raw pattern matches found: ${patternMatches.length}`);
      
      // Efficient filtering with single pass
      for (const match of patternMatches) {
        // Apply confidence threshold filter
        if (match.confidence < config.CONFIDENCE_THRESHOLD) {
          console.log("❌ [Performance] Filtering low confidence match:", 
            match.confidence.toFixed(2), "<", config.CONFIDENCE_THRESHOLD);
          continue;
        }
        
        // Create optimized finding object
        const finding: ClinicalFinding = {
          checklistItemId: match.checklistItemId,
          detectedValue: match.detectedValue,
          confidence: match.confidence,
          sourceText: match.sourceText,
          detectedAt: new Date(),
        };
        
        findings.push(finding);
        
        // Performance-optimized logging
        console.log("✅ [Performance] Clinical finding detected:", {
          id: finding.checklistItemId,
          value: finding.detectedValue,
          confidence: finding.confidence.toFixed(2),
          source: finding.sourceText.substring(0, 30) + "..."
        });
      }
      
    } catch (error) {
      console.error("❌ [Performance] Critical error in pattern matching:", error);
      console.error("❌ [Performance] Error context:", {
        textLength: text.length,
        textPreview: text.substring(0, 100),
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Graceful degradation - return empty array instead of throwing
      return [];
    }
    
    const processingTime = performance.now() - startTime;
    console.log(`📊 [Performance] Pattern matching complete - Found ${findings.length} findings in ${processingTime.toFixed(2)}ms`);
    
    return findings;
  }, [config.CONFIDENCE_THRESHOLD]);

  /**
   * Main transcript analysis function with debouncing and deduplication
   * @param text - Transcript text to analyze
   * @param isFinal - Whether this is a final transcript (affects processing priority)
   */
  const analyzeTranscript = useCallback((text: string, isFinal: boolean = false) => {
    console.log("🔍 Analyzing transcript - Length:", text.length, "IsFinal:", isFinal);
    
    // Skip analysis for empty or very short text
    if (!text || text.trim().length < 3) {
      console.log("⚠️ Skipping analysis - text too short or empty");
      return;
    }
    
    const textKey = text.toLowerCase().trim();
    
    // Skip if we've already processed this exact text
    if (processedTexts.current.has(textKey)) {
      console.log("🔄 Skipping already processed text");
      return;
    }
    
    // Clear existing debounce for new analysis
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // For final transcripts, process immediately; otherwise debounce
    const processDelay = isFinal ? 0 : config.DEBOUNCE_DELAY;
    
    setIsAnalyzing(true);
    
    debounceTimeout.current = setTimeout(() => {
      console.log("🔄 Processing debounced analysis...");
      
      try {
        // Find new pattern matches
        const newFindings = findPatternMatches(text);
        
        if (newFindings.length > 0) {
          setDetectedFindings(prevFindings => {
            // Deduplicate against existing findings
            const uniqueFindings = deduplicateFindings(newFindings, prevFindings);
            
            if (uniqueFindings.length > 0) {
              console.log("✅ Adding", uniqueFindings.length, "new clinical findings");
              
              // Update finding history for efficient lookup
              uniqueFindings.forEach(finding => {
                const key = `${finding.checklistItemId}-${finding.detectedValue}`;
                findingHistory.current.set(key, finding);
              });
              
              return [...prevFindings, ...uniqueFindings];
            }
            
            return prevFindings;
          });
        }
        
        // Update analysis state
        setAnalysisState(prevState => ({
          isAnalyzing: false,
          lastProcessedText: text,
          detectedFindings: [...prevState.detectedFindings, ...newFindings]
        }));
        
        // Add to processed texts cache (with size limit)
        processedTexts.current.add(textKey);
        if (processedTexts.current.size > config.MAX_PROCESSED_TEXTS) {
          // Remove oldest entries (simple FIFO cleanup)
          const textsArray = Array.from(processedTexts.current);
          processedTexts.current = new Set(textsArray.slice(-config.MAX_PROCESSED_TEXTS + 10));
        }
        
      } catch (error) {
        console.error("❌ [Clinical Analysis] Error during transcript analysis:", error);
        console.error("❌ [Clinical Analysis] Error context:", {
          textLength: text.length,
          isFinal,
          textPreview: text.substring(0, 100)
        });
        
        // Set error state for graceful degradation
        setHasError(true);
        setAnalysisState(prevState => ({
          ...prevState,
          isAnalyzing: false
        }));
        
        // Fallback: User can continue with manual selection
        console.log("🔄 [Clinical Analysis] Falling back to manual selection mode");
        
      } finally {
        setIsAnalyzing(false);
      }
    }, processDelay);
    
  }, [findPatternMatches, deduplicateFindings, config.DEBOUNCE_DELAY, config.MAX_PROCESSED_TEXTS]);

  /**
   * Clear all detected findings and reset analysis state
   * @function clearFindings
   */
  const clearFindings = useCallback(() => {
    console.log("🧹 Clearing all clinical findings and analysis state");
    
    setDetectedFindings([]);
    setHasError(false);
    setAnalysisState({
      isAnalyzing: false,
      lastProcessedText: '',
      detectedFindings: []
    });
    
    // Clear caches and refs
    processedTexts.current.clear();
    findingHistory.current.clear();
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = undefined;
    }
    
    setIsAnalyzing(false);
    console.log("✅ Clinical findings cleared successfully");
  }, []);

  /**
   * Retry analysis after error - resets error state and clears cache
   * @function retryAnalysis
   */
  const retryAnalysis = useCallback(() => {
    console.log("🔄 Retrying clinical analysis after error");
    setHasError(false);
    processedTexts.current.clear();
    findingHistory.current.clear();
    console.log("✅ Analysis retry ready");
  }, []);

  // Cleanup effect following .cursorrules patterns
  useEffect(() => {
    // Copy ref values for cleanup function
    const currentFindingHistory = findingHistory.current;
    const currentProcessedTexts = processedTexts.current;
    const currentDebounceTimeout = debounceTimeout.current;
    
    return () => {
      console.log("🧹 Cleaning up clinical analysis hook");
      
      // Clear all timeouts
      if (currentDebounceTimeout) {
        clearTimeout(currentDebounceTimeout);
      }
      
      // Clear caches using copied references
      currentProcessedTexts.clear();
      currentFindingHistory.clear();
    };
  }, []);

  // Update analysis state when findings change
  useEffect(() => {
    setAnalysisState(prevState => ({
      ...prevState,
      detectedFindings
    }));
  }, [detectedFindings]);

  console.log("📊 Clinical analysis hook state:", {
    findingsCount: detectedFindings.length,
    isAnalyzing,
    cacheSize: processedTexts.current.size
  });

  return {
    analyzeTranscript,
    detectedFindings,
    clearFindings,
    isAnalyzing,
    analysisState,
    hasError,
    retryAnalysis
  };
} 