/**
 * Patient information interface for the voice AI workflow
 */
export interface Patient {
  name: string;
  status: string;
  hasIndicator?: boolean;
  picture: string;
}

/**
 * Template configuration for clinical note workflows
 */
export interface Template {
  name: string;
}

/**
 * Clinical checklist item with support for auto-completion from speech analysis
 */
export interface ChecklistItem {
  /** Unique identifier for the checklist item */
  id: string;
  /** Display title for the checklist item */
  title: string;
  /** Available options for selection */
  options: string[];
  /** Currently selected option */
  selectedOption?: string;
  /** Flag indicating if this item was auto-completed by AI analysis */
  autoCompleted?: boolean;
  /** Timestamp when the item was detected/completed */
  detectedAt?: Date;
}

/**
 * Represents a clinical finding detected from speech transcript analysis
 */
export interface ClinicalFinding {
  /** ID of the checklist item this finding maps to */
  checklistItemId: string;
  /** The detected value/option to auto-select */
  detectedValue: string;
  /** Confidence score from 0-1 indicating detection certainty */
  confidence: number;
  /** Original transcript snippet that triggered this match */
  sourceText: string;
  /** Timestamp when this finding was detected */
  detectedAt: Date;
}

/**
 * Configuration for pattern matching rules for each checklist item
 */
export interface ClinicalPatternConfig {
  /** Map of checklist item IDs to their pattern rules */
  [checklistItemId: string]: {
    /** Map of option values to arrays of keywords/phrases that trigger them */
    [optionValue: string]: string[];
  };
}

/**
 * State interface for clinical analysis processing
 */
export interface ClinicalAnalysisState {
  /** Whether analysis is currently processing */
  isAnalyzing: boolean;
  /** Last transcript text that was processed */
  lastProcessedText: string;
  /** Array of all detected clinical findings */
  detectedFindings: ClinicalFinding[];
}

/**
 * View types for the voice AI workflow navigation
 */
export type ViewType = 'patient-selection' | 'template-selection' | 'clinical-note' | 'clinical-summary' | 'success'; 