"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClinicalPatternTester, TEST_CONVERSATION, type TestResult } from '@/components/voiceai/test/clinicalPatternTest';
import { getAllPatternMatches } from '@/components/voiceai/clinicalPatterns';
import { Sparkles, Play, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';

/**
 * Development testing page for clinical pattern validation
 * Only accessible in development mode
 */
export default function ClinicalPatternTestPage() {
  const [testResults, setTestResults] = useState<{
    summary: { total: number; passed: number; failed: number; successRate: number };
    results: TestResult[];
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [liveTestText, setLiveTestText] = useState('');
  const [liveFindings, setLiveFindings] = useState<Array<{
    checklistItemId: string;
    detectedValue: string;
    confidence: number;
    sourceText: string;
  }>>([]);

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    console.log('🧪 Starting comprehensive clinical pattern testing...');
    
    try {
      const tester = new ClinicalPatternTester(true);
      const results = tester.runAllTests();
      setTestResults(results);
      
      console.log('✅ Tests completed!', results.summary);
    } catch (error) {
      console.error('❌ Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Live pattern testing
  const handleLiveTest = (text: string) => {
    setLiveTestText(text);
    if (text.trim()) {
      const findings = getAllPatternMatches(text);
      setLiveFindings(findings);
      console.log('🔍 Live test findings:', findings);
    } else {
      setLiveFindings([]);
    }
  };

  // Quick conversation test
  const runConversationTest = () => {
    const conversation = TEST_CONVERSATION.fullText;
    handleLiveTest(conversation);
  };

  // Test individual phrases
  const testPhrase = (phrase: string) => {
    handleLiveTest(phrase);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Clinical Pattern Testing Suite
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive testing and validation for the dynamic clinical checklist system.
            Test pattern matching accuracy, performance, and edge cases.
          </p>
        </div>

        {/* Test Controls */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Test Controls</span>
            </h2>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={runConversationTest}
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Test Full Conversation</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Expected Findings Quick Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Quick Phrase Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TEST_CONVERSATION.expectedFindings.map((expected, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {expected.expectedItem} → {expected.expectedValue}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testPhrase(expected.phrase)}
                  >
                    Test
                  </Button>
                </div>
                <p className="text-sm text-gray-600 italic">
                  &quot;{expected.phrase}&quot;
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Pattern Testing */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🔍 Live Pattern Testing
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="liveTest" className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to test pattern matching:
              </label>
              <textarea
                id="liveTest"
                value={liveTestText}
                onChange={(e) => handleLiveTest(e.target.value)}
                placeholder="Enter clinical text to test (e.g., 'light gingival inflammation and moderate plaque accumulation')"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
            
            {/* Live Results */}
            {liveFindings.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-medium text-emerald-800 mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Detected Findings ({liveFindings.length})</span>
                </h3>
                <div className="space-y-2">
                  {liveFindings.map((finding, index) => (
                    <div key={index} className="bg-white border border-emerald-200 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">
                          {finding.checklistItemId} → {finding.detectedValue}
                        </span>
                        <Badge variant="secondary">
                          {Math.round(finding.confidence * 100)}% confidence
                        </Badge>
                      </div>
                                             <p className="text-sm text-gray-600">
                         Source: &quot;{finding.sourceText}&quot;
                       </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {liveTestText && liveFindings.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 flex items-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span>No clinical patterns detected in the provided text</span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Test Results */}
        {testResults && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📊 Test Results
            </h2>
            
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.summary.total}
                </div>
                <div className="text-sm text-blue-700">Total Tests</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {testResults.summary.passed}
                </div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {testResults.summary.failed}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {testResults.summary.successRate.toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">Success Rate</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Detailed Test Results:</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {testResults.results.map((result, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-3 ${
                      result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {result.testName}
                      </span>
                      <div className="flex items-center space-x-2">
                        {result.performanceMetrics && (
                          <>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {result.performanceMetrics.processingTime.toFixed(2)}ms
                            </Badge>
                          </>
                        )}
                        {result.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{result.details}</p>
                    
                    {result.actualFindings && result.actualFindings.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Findings:</div>
                        <div className="flex flex-wrap gap-1">
                          {result.actualFindings.map((finding, findingIndex) => (
                            <Badge key={findingIndex} variant="secondary" className="text-xs">
                              {finding.detectedValue} ({Math.round(finding.confidence * 100)}%)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Development Info */}
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Development Tool
          </h2>
          <p className="text-yellow-700 text-sm">
            This testing page is for development purposes only. It provides comprehensive validation
            of the clinical pattern matching system with the exact conversation phrases and edge cases.
            Open browser console for detailed debug logs.
          </p>
        </Card>
      </div>
    </div>
  );
} 