'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
  duration?: number; // Duration in milliseconds
}

export default function LoadingScreen({ 
  onLoadingComplete, 
  duration = 2500 
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add slight delay before hiding
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onLoadingComplete, 300); // Allow fade-out animation
          }, 200);
          return 100;
        }
        return prev + (100 / (duration / 50)); // Update every 50ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center space-y-8 px-6">
        {/* Icon Container */}
        <div className="flex items-center justify-center animate-pulse">
          <Image
            src="/icon_small.svg"
            alt="Dentrix Ascend AI"
            width={106} // 2x for crisp display on mobile
            height={72}  // 2x for crisp display on mobile
            className="w-[53px] h-[36px] object-contain"
            priority
          />
        </div>

        {/* Brand Label */}
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold text-gray-900 tracking-wide">
            Dentrix Ascend Voice AI Scribe
          </h1>
          <p className="text-sm text-gray-500">
            Initializing your workspace...
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="w-64 max-w-[80vw]">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Text */}
          <div className="text-center">
            <span className="text-xs text-gray-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Safe Area Support for Mobile */}
      <style jsx>{`
        @supports (padding: max(0px)) {
          .fixed {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
}