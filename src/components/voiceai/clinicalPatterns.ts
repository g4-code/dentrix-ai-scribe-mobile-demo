import type { ClinicalPatternConfig } from './types';

/**
 * Comprehensive clinical pattern matching database for auto-completing checklist items
 * Based on natural speech patterns from dentist-patient conversations
 */
export const clinicalPatterns: ClinicalPatternConfig = {
  "overall-oral-hygiene": {
    "Excellent": [
      "excellent oral hygiene",
      "outstanding hygiene", 
      "perfect hygiene",
      "exceptional oral hygiene",
      "superb hygiene",
      "pristine oral hygiene",
      "excellent overall hygiene",
      "hygiene is excellent",
      "oral hygiene is excellent"
    ],
    "Normal": [
      "normal oral hygiene",
      "oral hygiene is normal", 
      "hygiene is normal",
      "overall oral hygiene is normal",
      "average oral hygiene",
      "typical hygiene",
      "standard oral hygiene",
      "routine hygiene",
      "hygiene looks normal",
      "normal overall hygiene"
    ],
    "Poor": [
      "poor oral hygiene",
      "bad hygiene",
      "hygiene is poor", 
      "subpar oral hygiene",
      "inadequate hygiene",
      "below average hygiene",
      "needs improvement in hygiene",
      "hygiene could be better",
      "poor overall hygiene",
      "oral hygiene is poor"
    ]
  },

  "oral-hygiene-calculus": {
    "Excellent": [
      "no calculus",
      "excellent calculus control",
      "calculus free",
      "no tartar buildup",
      "clean teeth",
      "excellent calculus management",
      "no visible calculus",
      "calculus is excellent"
    ],
    "Good": [
      "light calculus",
      "minimal calculus",
      "slight calculus",
      "small amount of calculus", 
      "little calculus",
      "minor calculus buildup",
      "calculus is good",
      "manageable calculus",
      "calculus looks good"
    ],
    "Fair": [
      "moderate calculus", 
      "some calculus",
      "noticeable calculus",
      "fair amount of calculus",
      "calculus buildup present",
      "calculus is fair",
      "moderate tartar",
      "some tartar buildup"
    ],
    "Poor": [
      "heavy calculus",
      "significant calculus",
      "lots of calculus",
      "extensive calculus buildup",
      "poor calculus control",
      "calculus is poor",
      "heavy tartar",
      "severe calculus buildup"
    ]
  },

  "oral-hygiene-stain": {
    "None": [
      "no stains",
      "no staining",
      "stain free",
      "no discoloration",
      "clean appearance",
      "no visible stains",
      "stains are none",
      "teeth are clean"
    ],
    "Light": [
      "light stains",
      "minimal staining",
      "slight stains", 
      "light discoloration",
      "minor staining",
      "light staining on the molars",
      "some light stains",
      "stains are light",
      "light coffee stains",
      "light tea stains"
    ],
    "Moderate": [
      "moderate stains",
      "moderate staining",
      "noticeable stains",
      "some staining",
      "moderate discoloration",
      "stains are moderate",
      "fair amount of staining"
    ],
    "Heavy": [
      "heavy stains",
      "significant staining",
      "extensive stains",
      "severe staining",
      "heavy discoloration",
      "stains are heavy",
      "lots of staining"
    ]
  },

  "oral-hygiene-food-impaction": {
    "None": [
      "no food impaction",
      "no food debris",
      "clean interdental spaces",
      "no trapped food",
      "food impaction is none",
      "no food particles"
    ],
    "Light": [
      "light food impaction", 
      "minimal food debris",
      "slight food impaction",
      "some food particles",
      "light debris",
      "food impaction in the back",
      "minor food impaction",
      "food impaction is light"
    ],
    "Moderate": [
      "moderate food impaction",
      "noticeable food debris", 
      "some food impaction",
      "moderate debris",
      "food impaction is moderate",
      "fair amount of food debris"
    ],
    "Heavy": [
      "heavy food impaction",
      "significant food debris",
      "lots of food impaction", 
      "extensive debris",
      "food impaction is heavy",
      "severe food impaction"
    ]
  },

  "plaque-accumulation": {
    "None": [
      "no plaque",
      "plaque free",
      "no plaque accumulation",
      "clean of plaque",
      "plaque is none",
      "no visible plaque"
    ],
    "Minimal": [
      "minimal plaque",
      "slight plaque",
      "little plaque",
      "minor plaque accumulation",
      "plaque is minimal",
      "small amount of plaque"
    ],
    "Moderate": [
      "moderate plaque accumulation",
      "moderate plaque",
      "some plaque",
      "noticeable plaque",
      "plaque along the gumline",
      "moderate plaque buildup",
      "plaque is moderate",
      "fair amount of plaque"
    ],
    "Heavy": [
      "heavy plaque",
      "significant plaque accumulation",
      "lots of plaque",
      "extensive plaque",
      "plaque is heavy",
      "severe plaque buildup"
    ]
  },

  "gingival-inflammation": {
    "None": [
      "no gingival inflammation",
      "no inflammation",
      "healthy gums",
      "gums look healthy",
      "no swelling",
      "inflammation is none",
      "gums are normal"
    ],
    "Mild": [
      "light gingival inflammation",
      "mild inflammation", 
      "slight inflammation",
      "minor gum inflammation",
      "gums are slightly swollen",
      "light inflammation",
      "mild gingival swelling",
      "inflammation is mild",
      "slight gum irritation"
    ],
    "Moderate": [
      "moderate gingival inflammation",
      "moderate inflammation",
      "noticeable inflammation",
      "some gum swelling",
      "inflammation is moderate",
      "moderate gum inflammation"
    ],
    "Severe": [
      "severe gingival inflammation",
      "severe inflammation", 
      "significant inflammation",
      "extensive gum swelling",
      "inflammation is severe",
      "severe gum inflammation"
    ]
  },

  "periodontal-pockets": {
    "Normal": [
      "normal periodontal pockets",
      "pockets are normal",
      "healthy pocket depths",
      "normal pocket depth",
      "pockets look normal",
      "normal probing depths",
      "periodontal pockets normal"
    ],
    "3-4mm": [
      "3-4 mm pockets",
      "3 to 4 mm",
      "3–4 mm",
      "3-4mm pockets", 
      "pockets at 3-4mm",
      "couple at 3-4 mm",
      "some 3-4 millimeter pockets",
      "pockets are 3-4mm",
      "3-4 millimeter"
    ],
    "5-6mm": [
      "5-6 mm pockets",
      "5 to 6 mm",
      "5–6 mm",
      "5-6mm pockets",
      "pockets at 5-6mm", 
      "5-6 millimeter pockets",
      "pockets are 5-6mm"
    ],
    "7mm+": [
      "7mm or deeper",
      "7 mm or more",
      "7+ mm pockets",
      "deeper than 7mm",
      "pockets over 7mm",
      "7 millimeter or deeper",
      "deep pockets",
      "very deep pockets"
    ]
  }
};

/**
 * Helper function for case-insensitive pattern matching
 * @param text - Text to search in (transcript)
 * @param patterns - Array of patterns to match against
 * @returns Array of matched patterns with their positions
 */
export function findPatternMatches(text: string, patterns: string[]): Array<{
  pattern: string;
  match: string;
  startIndex: number;
  endIndex: number;
}> {
  const matches: Array<{
    pattern: string;
    match: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  
  const normalizedText = text.toLowerCase().trim();
  
  for (const pattern of patterns) {
    const normalizedPattern = pattern.toLowerCase();
    const index = normalizedText.indexOf(normalizedPattern);
    
    if (index !== -1) {
      matches.push({
        pattern,
        match: text.substring(index, index + normalizedPattern.length),
        startIndex: index,
        endIndex: index + normalizedPattern.length
      });
    }
  }
  
  // Sort by match length (longer matches first for better specificity)
  return matches.sort((a, b) => (b.endIndex - b.startIndex) - (a.endIndex - a.startIndex));
}

/**
 * Helper function to get all possible matches for a given text across all clinical patterns
 * @param text - Transcript text to analyze
 * @returns Array of potential clinical findings
 */
export function getAllPatternMatches(text: string): Array<{
  checklistItemId: string;
  detectedValue: string;
  confidence: number;
  sourceText: string;
  matches: ReturnType<typeof findPatternMatches>;
}> {
  const findings: Array<{
    checklistItemId: string;
    detectedValue: string;
    confidence: number;
    sourceText: string;
    matches: ReturnType<typeof findPatternMatches>;
  }> = [];
  
  for (const [checklistItemId, options] of Object.entries(clinicalPatterns)) {
    for (const [optionValue, patterns] of Object.entries(options)) {
      const matches = findPatternMatches(text, patterns);
      
      if (matches.length > 0) {
        // Calculate confidence based on match quality
        const bestMatch = matches[0];
        const matchLength = bestMatch.endIndex - bestMatch.startIndex;
        const confidence = Math.min(0.95, matchLength / 20 + 0.5); // Simple confidence calculation
        
        findings.push({
          checklistItemId,
          detectedValue: optionValue,
          confidence,
          sourceText: bestMatch.match,
          matches
        });
      }
    }
  }
  
  // Sort by confidence (highest first)
  return findings.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Type guard to ensure pattern configuration matches expected structure
 * @param patterns - Pattern configuration to validate
 * @returns boolean indicating if patterns are valid
 */
export function validatePatternConfig(patterns: unknown): patterns is ClinicalPatternConfig {
  if (typeof patterns !== 'object' || patterns === null) {
    return false;
  }
  
  const patternObj = patterns as Record<string, unknown>;
  
  for (const [key, value] of Object.entries(patternObj)) {
    if (typeof key !== 'string' || typeof value !== 'object' || value === null) {
      return false;
    }
    
    const optionsObj = value as Record<string, unknown>;
    for (const [optionKey, optionValue] of Object.entries(optionsObj)) {
      if (typeof optionKey !== 'string' || !Array.isArray(optionValue)) {
        return false;
      }
      
      if (!optionValue.every(item => typeof item === 'string')) {
        return false;
      }
    }
  }
  
  return true;
} 