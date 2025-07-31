"use client";

import { useEffect, useCallback, useRef } from 'react';

/**
 * Mobile Performance Optimization Hook
 * 
 * Provides optimizations for mobile devices including:
 * - Performance monitoring
 * - Memory management
 * - Battery optimization
 * - Touch responsiveness
 */
export function useMobileOptimization() {
  const performanceRef = useRef<{
    lastFrameTime: number;
    frameCount: number;
    memoryWarnings: number;
  }>({
    lastFrameTime: performance.now(),
    frameCount: 0,
    memoryWarnings: 0
  });

  // Detect if user prefers reduced motion  
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Monitor frame rate for performance
  const monitorFrameRate = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const now = performance.now();
    const delta = now - performanceRef.current.lastFrameTime;
    performanceRef.current.frameCount++;
    
    // If frame time is > 16.67ms (60fps), we're dropping frames
    if (delta > 16.67) {
      console.warn('🐌 Frame drop detected:', Math.round(delta), 'ms');
    }
    
    performanceRef.current.lastFrameTime = now;
    
    // Only monitor in development or when performance API is available
    if (process.env.NODE_ENV === 'development') {
      requestAnimationFrame(monitorFrameRate);
    }
  }, []);

  // Check memory usage
  const checkMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (memory) {
        const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
        const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
        
        // Warn if using more than 75% of available memory
        if (usedMB > limitMB * 0.75) {
          performanceRef.current.memoryWarnings++;
          console.warn('🧠 High memory usage:', usedMB, 'MB /', limitMB, 'MB');
          
          // Suggest garbage collection if available
          if ('gc' in window && typeof (window as { gc?: () => void }).gc === 'function') {
            console.log('🗑️ Suggesting garbage collection');
            (window as { gc: () => void }).gc();
          }
        }
      }
    }
  }, []);

  // Optimize touch events for mobile
  const optimizeTouchEvents = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Add passive event listeners for better scroll performance
    const addPassiveListener = (element: Element, event: string) => {
      element.addEventListener(event, () => {}, { passive: true });
    };

    // Apply to common scrollable elements
    document.querySelectorAll('.mobile-scroll').forEach(element => {
      addPassiveListener(element, 'touchstart');
      addPassiveListener(element, 'touchmove');
    });
  }, []);

  // Battery optimization
  const optimizeForBattery = useCallback(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    
    // Reduce animation frequency if battery is low
    if ('getBattery' in navigator) {
      const getBattery = (navigator as { getBattery?: () => Promise<{ level: number; addEventListener: (event: string, callback: () => void) => void }> }).getBattery;
      if (getBattery) {
        getBattery().then((battery) => {
          if (battery.level < 0.2) { // Less than 20% battery
            console.log('🔋 Low battery detected, reducing animations');
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
          }
          
          battery.addEventListener('levelchange', () => {
            if (battery.level < 0.2) {
              document.documentElement.style.setProperty('--animation-duration', '0.1s');
            } else {
              document.documentElement.style.removeProperty('--animation-duration');
            }
          });
        });
      }
    }
  }, []);

  // Haptic feedback for supported devices
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof navigator === 'undefined') return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      
      // Only vibrate if user hasn't disabled it and device supports it
      try {
        navigator.vibrate(patterns[type]);
      } catch {
        // Silently fail if vibration is not supported
      }
    }
  }, []);

  // Detect mobile device capabilities
  const getMobileCapabilities = useCallback(() => {
    const capabilities = {
      touchSupport: typeof window !== 'undefined' ? 'ontouchstart' in window : false,
      orientationSupport: typeof window !== 'undefined' ? 'orientation' in window : false,
      vibrationSupport: typeof navigator !== 'undefined' ? 'vibrate' in navigator : false,
      deviceMemory: typeof navigator !== 'undefined' ? (navigator as { deviceMemory?: number }).deviceMemory || 'unknown' : 'unknown',
      connectionType: typeof navigator !== 'undefined' ? (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType || 'unknown' : 'unknown',
      reducedMotion: prefersReducedMotion(),
      darkMode: typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false,
      highContrast: typeof window !== 'undefined' ? window.matchMedia('(prefers-contrast: high)').matches : false
    };

    console.log('📱 Mobile capabilities detected:', capabilities);
    return capabilities;
  }, [prefersReducedMotion]);

  // Initialize mobile optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log('🚀 Initializing mobile optimizations...');
    
    const capabilities = getMobileCapabilities();
    
    // Start performance monitoring in development
    if (process.env.NODE_ENV === 'development') {
      monitorFrameRate();
      
      // Check memory usage every 10 seconds
      const memoryInterval = setInterval(checkMemoryUsage, 10000);
      
      return () => {
        clearInterval(memoryInterval);
      };
    }

    // Apply mobile optimizations
    optimizeTouchEvents();
    optimizeForBattery();

    // Add mobile-specific CSS classes based on capabilities
    const html = document.documentElement;
    
    if (capabilities.touchSupport) {
      html.classList.add('touch-device');
    }
    
    if (capabilities.reducedMotion) {
      html.classList.add('reduced-motion');
    }
    
    if (capabilities.highContrast) {
      html.classList.add('high-contrast');
    }

    // Clean up on unmount
    return () => {
      html.classList.remove('touch-device', 'reduced-motion', 'high-contrast');
    };
  }, [getMobileCapabilities, monitorFrameRate, checkMemoryUsage, optimizeTouchEvents, optimizeForBattery]);

  // Public API
  return {
    // Performance utilities
    checkMemoryUsage,
    prefersReducedMotion,
    
    // Mobile interactions
    triggerHapticFeedback,
    
    // Device capabilities
    getMobileCapabilities,
    
    // Performance stats (development only)
    getPerformanceStats: () => performanceRef.current
  };
}

/**
 * Mobile-Optimized Loading Hook
 * 
 * Provides loading states optimized for mobile devices
 */
export function useMobileLoading(isLoading: boolean) {
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isLoading) {
      // Add loading class to prevent interactions
      document.body.classList.add('mobile-loading-active');
      
      // Set a timeout to warn about long loading times on mobile
      loadingTimeoutRef.current = setTimeout(() => {
        console.warn('⏰ Long loading time detected on mobile device');
      }, 5000);
    } else {
      document.body.classList.remove('mobile-loading-active');
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);
  
  return {
    isLoading,
    loadingClassName: isLoading ? 'mobile-loading' : ''
  };
}

/**
 * Mobile Keyboard Hook
 * 
 * Handles virtual keyboard behavior on mobile devices
 */
export function useMobileKeyboard() {
  const originalViewportHeight = useRef<number>(typeof window !== 'undefined' ? window.innerHeight : 0);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = originalViewportHeight.current - currentHeight;
      
      // If viewport height decreased significantly, keyboard is likely open
      const keyboardOpen = heightDifference > 150;
      
      if (keyboardOpen) {
        document.body.classList.add('keyboard-open');
        console.log('⌨️ Virtual keyboard detected');
      } else {
        document.body.classList.remove('keyboard-open');
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const scrollToInput = useCallback((inputElement: HTMLElement) => {
    // Scroll input into view when keyboard opens
    setTimeout(() => {
      inputElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }, 300); // Wait for keyboard animation
  }, []);
  
  return {
    scrollToInput
  };
}