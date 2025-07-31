"use client";

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Error boundary props interface
 * @interface ClinicalAnalysisErrorBoundaryProps
 */
interface ClinicalAnalysisErrorBoundaryProps {
  /** Child components to protect with error boundary */
  children: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Optional fallback component when error occurs */
  fallback?: ReactNode;
}

/**
 * Error boundary state interface
 * @interface ClinicalAnalysisErrorBoundaryState
 */
interface ClinicalAnalysisErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error object if one occurred */
  error?: Error;
  /** Additional error information */
  errorInfo?: React.ErrorInfo;
  /** Retry attempt count */
  retryCount: number;
}

/**
 * Error boundary component for clinical analysis with graceful degradation
 * 
 * Provides comprehensive error handling for the clinical analysis system:
 * - Catches and contains JavaScript errors
 * - Provides user-friendly error messages
 * - Offers retry functionality with exponential backoff
 * - Falls back to manual mode when AI fails
 * - Maintains app stability during clinical analysis errors
 * 
 * @class ClinicalAnalysisErrorBoundary
 * @extends {Component<ClinicalAnalysisErrorBoundaryProps, ClinicalAnalysisErrorBoundaryState>}
 * 
 * @example
 * ```tsx
 * <ClinicalAnalysisErrorBoundary onError={handleError}>
 *   <ClinicalNoteView />
 * </ClinicalAnalysisErrorBoundary>
 * ```
 */
export class ClinicalAnalysisErrorBoundary extends Component<
  ClinicalAnalysisErrorBoundaryProps,
  ClinicalAnalysisErrorBoundaryState
> {
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: ClinicalAnalysisErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  /**
   * React error boundary method - catches errors during rendering
   * @param error - The error that was thrown
   * @returns Updated state object
   */
  static getDerivedStateFromError(error: Error): Partial<ClinicalAnalysisErrorBoundaryState> {
    console.error('🚨 [Error Boundary] Clinical analysis error caught:', error);
    return {
      hasError: true,
      error,
    };
  }

  /**
   * React error boundary method - handles error reporting and logging
   * @param error - The error that was thrown
   * @param errorInfo - Additional error information from React
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 [Error Boundary] Clinical analysis error details:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ClinicalAnalysisErrorBoundary'
    });

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external error reporting service (if available)
    if (typeof window !== 'undefined') {
      const windowWithErrorReporting = window as Window & {
        errorReporting?: {
          captureException: (error: Error, options: { context: string; extra: React.ErrorInfo }) => void;
        };
      };
      
      if (windowWithErrorReporting.errorReporting) {
        windowWithErrorReporting.errorReporting.captureException(error, {
          context: 'clinical-analysis',
          extra: errorInfo,
        });
      }
    }
  }

  /**
   * Retry the clinical analysis with exponential backoff
   * @private
   */
  private handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount >= this.MAX_RETRY_ATTEMPTS) {
      console.warn('🚨 [Error Boundary] Max retry attempts reached');
      return;
    }

    console.log(`🔄 [Error Boundary] Retrying clinical analysis (attempt ${retryCount + 1}/${this.MAX_RETRY_ATTEMPTS})`);

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;

    this.retryTimeout = setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1,
      });
    }, delay);
  };

  /**
   * Reset error boundary to initial state
   * @private
   */
  private handleReset = () => {
    console.log('🔄 [Error Boundary] Resetting clinical analysis error boundary');
    
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
    });
  };

  /**
   * Cleanup on component unmount
   */
  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  /**
   * Render error boundary UI or children
   */
  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error boundary UI
      return (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  Clinical Analysis Temporarily Unavailable
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  The AI-powered checklist auto-completion is experiencing issues.
                </p>
              </div>
            </div>

            {/* Error details (in development mode) */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="bg-red-100 border border-red-200 rounded-md p-3">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Development Error Details:
                </h4>
                <code className="text-xs text-red-700 break-all">
                  {error.message}
                </code>
              </div>
            )}

            {/* Fallback instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Manual Mode Available</span>
              </h4>
              <p className="text-sm text-blue-700">
                You can continue using the checklist manually. All recording and transcription 
                features remain fully functional. The checklist items will need to be selected manually.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3">
              <Button 
                onClick={this.handleRetry}
                disabled={retryCount >= this.MAX_RETRY_ATTEMPTS}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  {retryCount >= this.MAX_RETRY_ATTEMPTS 
                    ? 'Max Retries Reached' 
                    : `Retry AI Analysis (${retryCount}/${this.MAX_RETRY_ATTEMPTS})`
                  }
                </span>
              </Button>
              
              <Button 
                onClick={this.handleReset}
                variant="outline"
              >
                Reset & Continue Manually
              </Button>
            </div>

            {/* Status indicator */}
            <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 inline-block">
              Status: Graceful degradation active - Manual mode enabled
            </div>
          </div>
        </Card>
      );
    }

    return children;
  }
} 