/**
 * Performance Monitoring
 * Simple performance tracking using Navigation Timing API
 */

(function() {
    'use strict';

    // Wait for page to fully load
    window.addEventListener('load', function() {
        // Use setTimeout to ensure all resources are loaded
        setTimeout(function() {
            measurePerformance();
        }, 0);
    });

    function measurePerformance() {
        // Check if Performance API is available
        if (!window.performance || !window.performance.timing) {
            console.log('Performance API not available');
            return;
        }

        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        // Log performance metrics
        const metrics = {
            'Page Load Time': formatTime(pageLoadTime),
            'Server Response Time': formatTime(connectTime),
            'DOM Render Time': formatTime(renderTime),
            'DNS Lookup': formatTime(perfData.domainLookupEnd - perfData.domainLookupStart),
            'DOM Interactive': formatTime(perfData.domInteractive - perfData.navigationStart)
        };

        console.group('📊 Performance Metrics');
        Object.entries(metrics).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
        console.groupEnd();

        // Check if page load time is acceptable
        if (pageLoadTime > 3000) {
            console.warn('⚠️ Page load time exceeds 3 seconds. Consider optimization.');
        } else {
            console.log('✅ Page load time is good (<3 seconds)');
        }

        // Track Web Vitals (if available)
        trackWebVitals();
    }

    function trackWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP (Largest Contentful Paint):', formatTime(lastEntry.renderTime || lastEntry.loadTime));
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

                // First Input Delay (FID) - only available on interaction
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('FID (First Input Delay):', formatTime(entry.processingStart - entry.startTime));
                    });
                });
                fidObserver.observe({ type: 'first-input', buffered: true });

                // Cumulative Layout Shift (CLS)
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    console.log('CLS (Cumulative Layout Shift):', clsValue.toFixed(3));
                });
                clsObserver.observe({ type: 'layout-shift', buffered: true });

            } catch (e) {
                // PerformanceObserver not fully supported
                console.log('Web Vitals tracking not fully supported');
            }
        }
    }

    function formatTime(ms) {
        if (!ms || ms < 0) return '0ms';
        if (ms < 1000) return `${Math.round(ms)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    }

    // Expose reset function globally for debugging
    window.logPerformance = measurePerformance;
})();
