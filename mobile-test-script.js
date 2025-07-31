/**
 * 📱 Mobile Testing Automation Script
 * 
 * This script provides automated testing utilities for the Voice AI Scribe mobile app.
 * Run in browser console for systematic testing across different devices.
 */

class MobileTestSuite {
  constructor() {
    this.currentDevice = null;
    this.testResults = [];
    this.startTime = Date.now();
    
    console.log('🚀 Mobile Test Suite Initialized');
    console.log('📱 Ready to test Voice AI Scribe mobile app');
  }

  /**
   * Initialize testing for a specific device
   */
  startDeviceTest(deviceName, width, height, orientation = 'portrait') {
    this.currentDevice = {
      name: deviceName,
      width,
      height,
      orientation,
      startTime: Date.now(),
      tests: []
    };
    
    console.log(`📱 Starting tests for ${deviceName} (${width}×${height}) - ${orientation}`);
    
    // Auto-detect current viewport
    const actualWidth = window.innerWidth;
    const actualHeight = window.innerHeight;
    
    if (Math.abs(actualWidth - width) > 10 || Math.abs(actualHeight - height) > 10) {
      console.warn(`⚠️  Viewport mismatch! Expected ${width}×${height}, got ${actualWidth}×${actualHeight}`);
      console.warn('Please adjust Chrome DevTools device simulation');
    }
    
    return this;
  }

  /**
   * Test if viewport is properly configured
   */
  testViewport() {
    const test = { name: 'Viewport Configuration', status: 'running', issues: [] };
    
    // Check viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      test.issues.push('Missing viewport meta tag');
    } else {
      console.log('✅ Viewport meta tag found:', viewportMeta.content);
    }
    
    // Check for horizontal scroll
    const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
    if (hasHorizontalScroll) {
      test.issues.push(`Horizontal scroll detected (${document.documentElement.scrollWidth}px > ${window.innerWidth}px)`);
    } else {
      console.log('✅ No horizontal scroll detected');
    }
    
    // Check safe area insets
    const safeAreaElements = document.querySelectorAll('[class*="safe-area"]');
    if (safeAreaElements.length > 0) {
      console.log(`✅ Safe area inset classes found: ${safeAreaElements.length} elements`);
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Test touch targets meet minimum size requirements
   */
  testTouchTargets() {
    const test = { name: 'Touch Target Sizes', status: 'running', issues: [] };
    const minTouchSize = 44; // Apple guidelines
    
    // Find all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], [onclick]');
    
    interactiveElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      if (width < minTouchSize || height < minTouchSize) {
        const elementDesc = element.tagName + (element.className ? `.${element.className.split(' ')[0]}` : '');
        test.issues.push(`Small touch target: ${elementDesc} (${Math.round(width)}×${Math.round(height)}px)`);
      }
    });
    
    if (test.issues.length === 0) {
      console.log(`✅ All ${interactiveElements.length} touch targets meet minimum size (44px)`);
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Test typography readability without zoom
   */
  testTypography() {
    const test = { name: 'Typography Readability', status: 'running', issues: [] };
    const minFontSize = 14; // Minimum readable size on mobile
    
    // Check all text elements
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, label');
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseFloat(computedStyle.fontSize);
      
      if (fontSize < minFontSize && element.textContent.trim()) {
        const elementDesc = element.tagName + (element.className ? `.${element.className.split(' ')[0]}` : '');
        test.issues.push(`Small font size: ${elementDesc} (${fontSize}px)`);
      }
    });
    
    if (test.issues.length === 0) {
      console.log('✅ All text elements meet minimum font size (14px)');
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Test scroll behavior and performance
   */
  testScrolling() {
    const test = { name: 'Scroll Performance', status: 'running', issues: [] };
    
    // Check for momentum scrolling
    const scrollElements = document.querySelectorAll('[class*="scroll"], [style*="overflow"]');
    
    scrollElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const webkitOverflowScrolling = computedStyle.getPropertyValue('-webkit-overflow-scrolling');
      
      if (webkitOverflowScrolling !== 'touch') {
        test.issues.push('Missing -webkit-overflow-scrolling: touch for smooth iOS scrolling');
      }
    });
    
    // Test scroll behavior
    const scrollBehavior = window.getComputedStyle(document.documentElement).scrollBehavior;
    if (scrollBehavior !== 'smooth') {
      console.log('ℹ️  Scroll behavior is not set to smooth globally');
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Test Voice AI workflow functionality
   */
  async testVoiceWorkflow() {
    const test = { name: 'Voice AI Workflow', status: 'running', issues: [] };
    
    try {
      // Check if we're on the Voice AI app
      const voiceAIHeader = document.querySelector('h1, h2, h3');
      if (voiceAIHeader && voiceAIHeader.textContent.includes('Voice AI')) {
        console.log('✅ Voice AI interface detected');
      } else {
        test.issues.push('Voice AI interface not found');
      }
      
      // Check for recording button
      const recordButton = document.querySelector('button[aria-label*="recording"], button[class*="record"]');
      if (recordButton) {
        console.log('✅ Recording button found');
        
        // Test button size
        const rect = recordButton.getBoundingClientRect();
        if (rect.width < 80 || rect.height < 80) {
          test.issues.push(`Recording button too small: ${Math.round(rect.width)}×${Math.round(rect.height)}px`);
        }
      } else {
        console.log('ℹ️  Recording button not found (may be on different workflow step)');
      }
      
      // Check for patient cards
      const patientCards = document.querySelectorAll('[class*="patient"], button[aria-label*="patient"]');
      if (patientCards.length > 0) {
        console.log(`✅ ${patientCards.length} patient cards found`);
      }
      
      // Check for clinical checklist
      const checklistItems = document.querySelectorAll('input[type="radio"], [role="radio"]');
      if (checklistItems.length > 0) {
        console.log(`✅ ${checklistItems.length} clinical checklist items found`);
      }
      
    } catch (error) {
      test.issues.push(`Workflow test error: ${error.message}`);
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Test MediaRecorder and getUserMedia support
   */
  async testAudioSupport() {
    const test = { name: 'Audio Recording Support', status: 'running', issues: [] };
    
    try {
      // Check MediaRecorder support
      if (!window.MediaRecorder) {
        test.issues.push('MediaRecorder API not supported');
      } else {
        console.log('✅ MediaRecorder API supported');
      }
      
      // Check getUserMedia support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        test.issues.push('getUserMedia API not supported');
      } else {
        console.log('✅ getUserMedia API supported');
      }
      
      // Check supported audio formats
      const supportedFormats = [];
      const testFormats = ['audio/webm', 'audio/mp4', 'audio/ogg'];
      
      testFormats.forEach(format => {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(format)) {
          supportedFormats.push(format);
        }
      });
      
      if (supportedFormats.length > 0) {
        console.log('✅ Supported audio formats:', supportedFormats);
      } else {
        test.issues.push('No supported audio formats found');
      }
      
    } catch (error) {
      test.issues.push(`Audio support test error: ${error.message}`);
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Test performance metrics
   */
  testPerformance() {
    const test = { name: 'Performance Metrics', status: 'running', issues: [] };
    
    try {
      // Check paint timing
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        console.log(`⏱️  ${entry.name}: ${Math.round(entry.startTime)}ms`);
        
        if (entry.name === 'first-contentful-paint' && entry.startTime > 3000) {
          test.issues.push(`Slow first contentful paint: ${Math.round(entry.startTime)}ms`);
        }
      });
      
      // Check navigation timing
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry) {
        const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        console.log(`⏱️  Page load time: ${Math.round(loadTime)}ms`);
        
        if (loadTime > 5000) {
          test.issues.push(`Slow page load: ${Math.round(loadTime)}ms`);
        }
      }
      
      // Check memory usage (if available)
      if (performance.memory) {
        const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        console.log(`💾 Memory usage: ${memoryMB}MB`);
        
        if (memoryMB > 50) {
          test.issues.push(`High memory usage: ${memoryMB}MB`);
        }
      }
      
    } catch (error) {
      test.issues.push(`Performance test error: ${error.message}`);
    }
    
    test.status = test.issues.length === 0 ? 'passed' : 'failed';
    this.logTest(test);
    return this;
  }

  /**
   * Run all tests for current device
   */
  async runAllTests() {
    console.log(`🧪 Running all tests for ${this.currentDevice?.name || 'current device'}`);
    
    this
      .testViewport()
      .testTouchTargets()
      .testTypography()
      .testScrolling();
    
    await this.testVoiceWorkflow();
    await this.testAudioSupport();
    
    this.testPerformance();
    
    this.finishDeviceTest();
    return this;
  }

  /**
   * Finish testing for current device
   */
  finishDeviceTest() {
    if (!this.currentDevice) return;
    
    const duration = Date.now() - this.currentDevice.startTime;
    const passedTests = this.currentDevice.tests.filter(t => t.status === 'passed').length;
    const totalTests = this.currentDevice.tests.length;
    
    console.log(`📊 ${this.currentDevice.name} Test Complete:`);
    console.log(`   ✅ Passed: ${passedTests}/${totalTests} tests`);
    console.log(`   ⏱️  Duration: ${Math.round(duration/1000)}s`);
    
    this.testResults.push(this.currentDevice);
    this.currentDevice = null;
    
    return this;
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    console.log('\n📋 MOBILE TEST REPORT');
    console.log('=' .repeat(50));
    
    this.testResults.forEach(device => {
      console.log(`\n📱 ${device.name} (${device.width}×${device.height}) - ${device.orientation}`);
      
      device.tests.forEach(test => {
        const icon = test.status === 'passed' ? '✅' : '❌';
        console.log(`  ${icon} ${test.name}`);
        
        if (test.issues && test.issues.length > 0) {
          test.issues.forEach(issue => {
            console.log(`     🚨 ${issue}`);
          });
        }
      });
    });
    
    const totalDevices = this.testResults.length;
    const totalTests = this.testResults.reduce((sum, device) => sum + device.tests.length, 0);
    const passedTests = this.testResults.reduce((sum, device) => 
      sum + device.tests.filter(t => t.status === 'passed').length, 0
    );
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`   📱 Devices Tested: ${totalDevices}`);
    console.log(`   ✅ Tests Passed: ${passedTests}/${totalTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`   ⏱️  Total Duration: ${Math.round((Date.now() - this.startTime)/1000)}s`);
    
    return this.testResults;
  }

  /**
   * Log individual test result
   */
  logTest(test) {
    if (!this.currentDevice) return;
    
    this.currentDevice.tests.push(test);
    
    const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏳';
    console.log(`${icon} ${test.name}`);
    
    if (test.issues && test.issues.length > 0) {
      test.issues.forEach(issue => {
        console.log(`   🚨 ${issue}`);
      });
    }
  }
}

// Device presets for easy testing
const DEVICES = {
  IPHONE_SE: { name: 'iPhone SE', width: 375, height: 667 },
  IPHONE_12: { name: 'iPhone 12', width: 390, height: 844 },
  IPHONE_14_PRO_MAX: { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  SAMSUNG_S20: { name: 'Samsung Galaxy S20', width: 360, height: 800 },
  IPAD: { name: 'iPad', width: 768, height: 1024 }
};

// Quick test functions for console use
window.mobileTest = new MobileTestSuite();

// Quick test commands
window.quickTest = {
  iPhoneSE: () => mobileTest.startDeviceTest('iPhone SE', 375, 667).runAllTests(),
  iPhone12: () => mobileTest.startDeviceTest('iPhone 12', 390, 844).runAllTests(),
  iPhone14ProMax: () => mobileTest.startDeviceTest('iPhone 14 Pro Max', 430, 932).runAllTests(),
  samsungS20: () => mobileTest.startDeviceTest('Samsung Galaxy S20', 360, 800).runAllTests(),
  iPad: () => mobileTest.startDeviceTest('iPad', 768, 1024).runAllTests(),
  
  landscape: (device) => {
    const d = DEVICES[device.toUpperCase()];
    if (d) {
      return mobileTest.startDeviceTest(d.name + ' Landscape', d.height, d.width, 'landscape').runAllTests();
    }
  },
  
  report: () => mobileTest.generateReport()
};

console.log('🚀 Mobile Test Suite Ready!');
console.log('📱 Quick Commands:');
console.log('   quickTest.iPhoneSE() - Test iPhone SE');
console.log('   quickTest.iPhone12() - Test iPhone 12');
console.log('   quickTest.iPad() - Test iPad');
console.log('   quickTest.landscape("IPHONE_12") - Test landscape');
console.log('   quickTest.report() - Generate full report');
console.log('');
console.log('🔧 Manual Testing:');
console.log('   mobileTest.startDeviceTest("Custom", 320, 568).runAllTests()');
console.log('   mobileTest.testViewport() - Test specific aspect');
console.log('');