/**
 * Comprehensive Clinical Pattern Testing Suite
 * Tests the dynamic checklist system with exact conversation phrases
 */

import { getAllPatternMatches, clinicalPatterns } from '../clinicalPatterns';

/**
 * Browser performance memory interface
 */
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/**
 * Test conversation data from the dentist-patient example
 */
export const TEST_CONVERSATION = {
  fullText: `Good morning, Mr. Torres. I'll be doing a quick oral hygiene assessment today. Have you noticed any bleeding when you brush or floss? Just a little sometimes, especially when I floss. Thanks for mentioning that. Let's take a look... Your overall oral hygiene is normal. I do see some light calculus behind your lower front teeth and light stains on the molars, likely from coffee or tea. There's light food impaction in the back as well. Oh, I do tend to eat nuts and forget to floss after. That could explain it. There's also moderate plaque accumulation along the gumline and light gingival inflammation—the gums are slightly swollen, especially near the back molars. Is that serious? Not yet, but it can lead to problems. I'm also checking your periodontal pockets... Most are normal, though I'm seeing a couple at 3–4 mm, which we'll monitor. Do you brush twice a day and floss daily? I brush twice, but I'm not great at flossing. Let's work on that, especially near those problem areas. You're doing fairly well overall.`,
  
  expectedFindings: [
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
  ],

  // Individual test segments for incremental testing
  testSegments: [
    "Your overall oral hygiene is normal.",
    "I do see some light calculus behind your lower front teeth",
    "and light stains on the molars, likely from coffee or tea.",
    "There's light food impaction in the back as well.",
    "There's also moderate plaque accumulation along the gumline",
    "and light gingival inflammation—the gums are slightly swollen",
    "though I'm seeing a couple at 3–4 mm, which we'll monitor."
  ]
};

/**
 * Edge case test scenarios
 */
export const EDGE_CASE_TESTS = [
  {
    name: "Multiple findings in single sentence",
    text: "I see light calculus and moderate plaque accumulation with mild inflammation",
    expectedCount: 3
  },
  {
    name: "Partial matches should not trigger",
    text: "The lighting in the room is normal and moderate temperature",
    expectedCount: 0
  },
  {
    name: "Case insensitive matching",
    text: "LIGHT GINGIVAL INFLAMMATION and Moderate Plaque Accumulation",
    expectedCount: 2
  },
  {
    name: "Punctuation handling", 
    text: "Light calculus, moderate stains, and 3-4mm pockets.",
    expectedCount: 3
  },
  {
    name: "Empty and whitespace handling",
    text: "   ",
    expectedCount: 0
  }
];

/**
 * Performance test configuration
 */
export const PERFORMANCE_TESTS = {
  longTranscript: "Your overall oral hygiene is normal. ".repeat(100) + 
                 "Light calculus present. ".repeat(50) +
                 "Moderate plaque accumulation noted. ".repeat(75),
  iterationCount: 1000,
  maxProcessingTime: 100, // milliseconds
  maxMemoryIncrease: 10 // MB
};

/**
 * Test Results Interface
 */
export interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  actualFindings?: Array<{
    checklistItemId: string;
    detectedValue: string;
    confidence: number;
    sourceText: string;
  }>;
  performanceMetrics?: {
    processingTime: number;
    memoryUsage: number;
  };
}

/**
 * Main test runner
 */
export class ClinicalPatternTester {
  private results: TestResult[] = [];
  private debugMode: boolean = false;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  /**
   * Enable debug logging
   */
  enableDebug() {
    this.debugMode = true;
  }

  /**
   * Log debug information
   */
  private debug(message: string, data?: unknown) {
    if (this.debugMode) {
      console.log(`🧪 [Clinical Test] ${message}`, data || '');
    }
  }

  /**
   * Test exact conversation phrases
   */
  testConversationPhrases(): TestResult[] {
    this.debug("Starting conversation phrase tests");
    
    const testResults: TestResult[] = [];

    // Test full conversation
    const fullTextFindings = getAllPatternMatches(TEST_CONVERSATION.fullText);
    this.debug(`Full conversation analysis found ${fullTextFindings.length} findings`, fullTextFindings);

    // Test each expected finding
    for (const expected of TEST_CONVERSATION.expectedFindings) {
      const testName = `Phrase: "${expected.phrase}"`;
      this.debug(`Testing: ${testName}`);

      // Test the specific phrase
      const phraseFindings = getAllPatternMatches(expected.phrase);
      const matchingFinding = phraseFindings.find(f => 
        f.checklistItemId === expected.expectedItem && 
        f.detectedValue === expected.expectedValue
      );

      const passed = matchingFinding !== undefined && 
                    matchingFinding.confidence >= expected.minConfidence;

      testResults.push({
        testName,
        passed,
        details: passed 
          ? `✅ Found ${expected.expectedValue} for ${expected.expectedItem} (confidence: ${matchingFinding?.confidence.toFixed(2)})`
          : `❌ Expected ${expected.expectedValue} for ${expected.expectedItem}, got: ${phraseFindings.map(f => `${f.detectedValue}(${f.confidence.toFixed(2)})`).join(', ') || 'no matches'}`,
        actualFindings: phraseFindings
      });

      if (!passed) {
        this.debug("❌ Test failed", { expected, actualFindings: phraseFindings });
      }
    }

    // Test incremental segments
    for (let i = 0; i < TEST_CONVERSATION.testSegments.length; i++) {
      const segment = TEST_CONVERSATION.testSegments[i];
      const testName = `Segment ${i + 1}: "${segment.substring(0, 30)}..."`;
      
      const segmentFindings = getAllPatternMatches(segment);
      this.debug(`Segment ${i + 1} found ${segmentFindings.length} findings`);

      testResults.push({
        testName,
        passed: true, // Informational test
        details: `Found ${segmentFindings.length} clinical findings: ${segmentFindings.map(f => `${f.detectedValue}`).join(', ')}`,
        actualFindings: segmentFindings
      });
    }

    this.results.push(...testResults);
    return testResults;
  }

  /**
   * Test edge cases
   */
  testEdgeCases(): TestResult[] {
    this.debug("Starting edge case tests");
    
    const testResults: TestResult[] = [];

    for (const edgeCase of EDGE_CASE_TESTS) {
      const testName = `Edge Case: ${edgeCase.name}`;
      this.debug(`Testing: ${testName}`);

      const findings = getAllPatternMatches(edgeCase.text);
      const passed = findings.length === edgeCase.expectedCount;

      testResults.push({
        testName,
        passed,
        details: passed
          ? `✅ Expected ${edgeCase.expectedCount} findings, got ${findings.length}`
          : `❌ Expected ${edgeCase.expectedCount} findings, got ${findings.length}: ${findings.map(f => f.detectedValue).join(', ')}`,
        actualFindings: findings
      });

      if (!passed) {
        this.debug("❌ Edge case failed", { edgeCase, findings });
      }
    }

    this.results.push(...testResults);
    return testResults;
  }

  /**
   * Test performance
   */
  testPerformance(): TestResult[] {
    this.debug("Starting performance tests");
    
    const testResults: TestResult[] = [];

    // Memory baseline
    const performanceWithMemory = performance as typeof performance & { memory?: PerformanceMemory };
    const memoryBefore = performanceWithMemory.memory?.usedJSHeapSize || 0;

    // Processing time test
    const startTime = performance.now();
    
    for (let i = 0; i < PERFORMANCE_TESTS.iterationCount; i++) {
      getAllPatternMatches(PERFORMANCE_TESTS.longTranscript);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / PERFORMANCE_TESTS.iterationCount;

    // Memory after
    const memoryAfter = performanceWithMemory.memory?.usedJSHeapSize || 0;
    const memoryIncrease = (memoryAfter - memoryBefore) / 1024 / 1024; // MB

    // Performance test result
    const performancePassed = avgTime < PERFORMANCE_TESTS.maxProcessingTime;
    const memoryPassed = memoryIncrease < PERFORMANCE_TESTS.maxMemoryIncrease;

    testResults.push({
      testName: "Performance: Processing Speed",
      passed: performancePassed,
      details: performancePassed
        ? `✅ Avg processing time: ${avgTime.toFixed(2)}ms (limit: ${PERFORMANCE_TESTS.maxProcessingTime}ms)`
        : `❌ Avg processing time: ${avgTime.toFixed(2)}ms exceeded limit of ${PERFORMANCE_TESTS.maxProcessingTime}ms`,
      performanceMetrics: {
        processingTime: avgTime,
        memoryUsage: memoryIncrease
      }
    });

    testResults.push({
      testName: "Performance: Memory Usage",
      passed: memoryPassed,
      details: memoryPassed
        ? `✅ Memory increase: ${memoryIncrease.toFixed(2)}MB (limit: ${PERFORMANCE_TESTS.maxMemoryIncrease}MB)`
        : `❌ Memory increase: ${memoryIncrease.toFixed(2)}MB exceeded limit of ${PERFORMANCE_TESTS.maxMemoryIncrease}MB`,
      performanceMetrics: {
        processingTime: avgTime,
        memoryUsage: memoryIncrease
      }
    });

    this.results.push(...testResults);
    return testResults;
  }

  /**
   * Test pattern configuration validation
   */
  testPatternValidation(): TestResult[] {
    this.debug("Starting pattern validation tests");
    
    const testResults: TestResult[] = [];

    // Test pattern completeness
    const expectedChecklistItems = [
      "overall-oral-hygiene",
      "oral-hygiene-calculus", 
      "oral-hygiene-stain",
      "oral-hygiene-food-impaction",
      "plaque-accumulation",
      "gingival-inflammation",
      "periodontal-pockets"
    ];

    const missingPatterns = expectedChecklistItems.filter(item => !clinicalPatterns[item]);
    const completenessTest = missingPatterns.length === 0;

    testResults.push({
      testName: "Pattern Completeness",
      passed: completenessTest,
      details: completenessTest
        ? `✅ All ${expectedChecklistItems.length} checklist items have patterns`
        : `❌ Missing patterns for: ${missingPatterns.join(', ')}`
    });

    // Test pattern coverage (each option has patterns)
    let totalOptions = 0;
    let optionsWithPatterns = 0;

    for (const [itemId, options] of Object.entries(clinicalPatterns)) {
      for (const [optionValue, patterns] of Object.entries(options)) {
        totalOptions++;
        if (patterns.length > 0) {
          optionsWithPatterns++;
        } else {
          this.debug(`❌ No patterns for ${itemId}.${optionValue}`);
        }
      }
    }

    const coverageTest = totalOptions === optionsWithPatterns;
    testResults.push({
      testName: "Pattern Coverage",
      passed: coverageTest,
      details: coverageTest
        ? `✅ All ${totalOptions} options have patterns`
        : `❌ ${totalOptions - optionsWithPatterns} options missing patterns`
    });

    this.results.push(...testResults);
    return testResults;
  }

  /**
   * Run all tests
   */
  runAllTests(): {
    summary: {
      total: number;
      passed: number;
      failed: number;
      successRate: number;
    };
    results: TestResult[];
  } {
    this.debug("🚀 Starting comprehensive clinical pattern testing");
    
    this.results = [];

    // Run all test suites
    this.testConversationPhrases();
    this.testEdgeCases();
    this.testPerformance();
    this.testPatternValidation();

    // Calculate summary
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const successRate = (passed / total) * 100;

    const summary = {
      total,
      passed,
      failed,
      successRate
    };

    this.debug("📊 Test Summary", summary);

    return {
      summary,
      results: this.results
    };
  }

  /**
   * Generate detailed test report
   */
  generateReport(): string {
    const testResults = this.runAllTests();
    
    let report = `
# Clinical Pattern Testing Report

## Summary
- **Total Tests**: ${testResults.summary.total}
- **Passed**: ${testResults.summary.passed} ✅
- **Failed**: ${testResults.summary.failed} ❌
- **Success Rate**: ${testResults.summary.successRate.toFixed(1)}%

## Detailed Results

`;

    for (const result of testResults.results) {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      report += `### ${result.testName} - ${status}\n`;
      report += `${result.details}\n\n`;
      
      if (result.actualFindings && result.actualFindings.length > 0) {
        report += `**Findings:**\n`;
        for (const finding of result.actualFindings) {
          report += `- ${finding.checklistItemId}: ${finding.detectedValue} (${(finding.confidence * 100).toFixed(1)}% confidence)\n`;
        }
        report += `\n`;
      }
      
      if (result.performanceMetrics) {
        report += `**Performance:**\n`;
        report += `- Processing Time: ${result.performanceMetrics.processingTime.toFixed(2)}ms\n`;
        report += `- Memory Usage: ${result.performanceMetrics.memoryUsage.toFixed(2)}MB\n\n`;
      }
    }

    return report;
  }
}

/**
 * Quick test runner for development
 */
export function runQuickTest(): void {
  console.log('🧪 Running quick clinical pattern test...');
  
  const tester = new ClinicalPatternTester(true);
  const results = tester.runAllTests();
  
  console.log('\n📊 Test Results:');
  console.log(`Total: ${results.summary.total}, Passed: ${results.summary.passed}, Failed: ${results.summary.failed}`);
  console.log(`Success Rate: ${results.summary.successRate.toFixed(1)}%`);
  
  // Show failed tests
  const failedTests = results.results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`- ${test.testName}: ${test.details}`);
    });
  }
  
  console.log('\n✅ Test complete!');
}

/**
 * Export for browser console testing
 */
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as Record<string, any>)['runClinicalPatternTest'] = runQuickTest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  (window as Record<string, any>)['ClinicalPatternTester'] = ClinicalPatternTester;
} 