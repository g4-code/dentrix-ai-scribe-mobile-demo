/**
 * Quick validation script for clinical pattern matching
 * Tests the exact phrases from the dentist conversation example
 */

import { getAllPatternMatches } from '../clinicalPatterns';

/**
 * Validation results
 */
export interface ValidationResult {
  phrase: string;
  expectedItem: string;
  expectedValue: string;
  found: boolean;
  actualFindings: Array<{
    checklistItemId: string;
    detectedValue: string;
    confidence: number;
    sourceText: string;
  }>;
  confidence: number;
  passed: boolean;
}

/**
 * Test phrases from the exact conversation example
 */
const CONVERSATION_TEST_PHRASES = [
  {
    phrase: "overall oral hygiene is normal",
    expectedItem: "overall-oral-hygiene",
    expectedValue: "Normal",
    minConfidence: 0.7
  },
  {
    phrase: "light calculus behind your lower front teeth",
    expectedItem: "oral-hygiene-calculus", 
    expectedValue: "Good",
    minConfidence: 0.6
  },
  {
    phrase: "light stains on the molars",
    expectedItem: "oral-hygiene-stain",
    expectedValue: "Light", 
    minConfidence: 0.6
  },
  {
    phrase: "light food impaction in the back",
    expectedItem: "oral-hygiene-food-impaction",
    expectedValue: "Light",
    minConfidence: 0.6
  },
  {
    phrase: "moderate plaque accumulation",
    expectedItem: "plaque-accumulation",
    expectedValue: "Moderate",
    minConfidence: 0.7
  },
  {
    phrase: "light gingival inflammation",
    expectedItem: "gingival-inflammation", 
    expectedValue: "Mild",
    minConfidence: 0.6
  },
  {
    phrase: "3–4 mm",
    expectedItem: "periodontal-pockets",
    expectedValue: "3-4mm",
    minConfidence: 0.7
  }
];

/**
 * Validate all conversation phrases
 */
export function validateConversationPhrases(): ValidationResult[] {
  console.log('🧪 [Validation] Starting conversation phrase validation...');
  
  const results: ValidationResult[] = [];
  
  for (const testCase of CONVERSATION_TEST_PHRASES) {
    console.log(`🔍 [Validation] Testing: "${testCase.phrase}"`);
    
    const findings = getAllPatternMatches(testCase.phrase);
    const matchingFinding = findings.find(f => 
      f.checklistItemId === testCase.expectedItem && 
      f.detectedValue === testCase.expectedValue
    );
    
    const found = matchingFinding !== undefined;
    const confidence = matchingFinding?.confidence || 0;
    const passed = found && confidence >= testCase.minConfidence;
    
    const result: ValidationResult = {
      phrase: testCase.phrase,
      expectedItem: testCase.expectedItem,
      expectedValue: testCase.expectedValue,
      found,
      actualFindings: findings,
      confidence,
      passed
    };
    
    results.push(result);
    
    if (passed) {
      console.log(`✅ [Validation] PASS: Found ${testCase.expectedValue} for ${testCase.expectedItem} (${(confidence * 100).toFixed(1)}% confidence)`);
    } else {
      console.log(`❌ [Validation] FAIL: Expected ${testCase.expectedValue} for ${testCase.expectedItem}`);
      console.log(`    Found: ${findings.map(f => `${f.detectedValue}(${(f.confidence * 100).toFixed(1)}%)`).join(', ') || 'no matches'}`);
    }
  }
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.passed).length;
  const successRate = (passedTests / totalTests) * 100;
  
  console.log(`📊 [Validation] Summary: ${passedTests}/${totalTests} tests passed (${successRate.toFixed(1)}% success rate)`);
  
  return results;
}

/**
 * Test the full conversation text
 */
export function validateFullConversation(): {
  totalFindings: number;
  uniqueItems: string[];
  findings: Array<{
    checklistItemId: string;
    detectedValue: string;
    confidence: number;
    sourceText: string;
  }>;
} {
  const fullConversation = `Good morning, Mr. Torres. I'll be doing a quick oral hygiene assessment today. Have you noticed any bleeding when you brush or floss? Just a little sometimes, especially when I floss. Thanks for mentioning that. Let's take a look... Your overall oral hygiene is normal. I do see some light calculus behind your lower front teeth and light stains on the molars, likely from coffee or tea. There's light food impaction in the back as well. Oh, I do tend to eat nuts and forget to floss after. That could explain it. There's also moderate plaque accumulation along the gumline and light gingival inflammation—the gums are slightly swollen, especially near the back molars. Is that serious? Not yet, but it can lead to problems. I'm also checking your periodontal pockets... Most are normal, though I'm seeing a couple at 3–4 mm, which we'll monitor. Do you brush twice a day and floss daily? I brush twice, but I'm not great at flossing. Let's work on that, especially near those problem areas. You're doing fairly well overall.`;
  
  console.log('🧪 [Validation] Testing full conversation...');
  
  const findings = getAllPatternMatches(fullConversation);
  const uniqueItems = Array.from(new Set(findings.map(f => f.checklistItemId)));
  
  console.log(`📊 [Validation] Full conversation analysis:`);
  console.log(`   Total findings: ${findings.length}`);
  console.log(`   Unique checklist items: ${uniqueItems.length}/7`);
  console.log(`   Items found: ${uniqueItems.join(', ')}`);
  
  findings.forEach(finding => {
    console.log(`   • ${finding.checklistItemId}: ${finding.detectedValue} (${(finding.confidence * 100).toFixed(1)}% confidence)`);
    console.log(`     Source: "${finding.sourceText}"`);
  });
  
  return {
    totalFindings: findings.length,
    uniqueItems,
    findings
  };
}

/**
 * Run quick validation tests
 */
export function runQuickValidation(): {
  phraseResults: ValidationResult[];
  conversationResults: ReturnType<typeof validateFullConversation>;
  summary: {
    phraseSuccessRate: number;
    conversationCoverage: number;
    totalFindings: number;
  };
} {
  console.log('🚀 [Validation] Starting quick pattern validation tests...');
  
  const phraseResults = validateConversationPhrases();
  const conversationResults = validateFullConversation();
  
  const phraseSuccessRate = (phraseResults.filter(r => r.passed).length / phraseResults.length) * 100;
  const conversationCoverage = (conversationResults.uniqueItems.length / 7) * 100;
  
  const summary = {
    phraseSuccessRate,
    conversationCoverage,
    totalFindings: conversationResults.totalFindings
  };
  
  console.log('📊 [Validation] Quick test summary:');
  console.log(`   Phrase Success Rate: ${phraseSuccessRate.toFixed(1)}%`);
  console.log(`   Conversation Coverage: ${conversationCoverage.toFixed(1)}% (${conversationResults.uniqueItems.length}/7 items)`);
  console.log(`   Total Findings: ${conversationResults.totalFindings}`);
  
  return {
    phraseResults,
    conversationResults,
    summary
  };
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as Record<string, any>)['validateClinicalPatterns'] = runQuickValidation;
} 