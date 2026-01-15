/**
 * Custom React hooks for telemetry tracking
 * 
 * Provides convenient hooks for common tracking scenarios
 */

import { useEffect } from 'react';
import { trackEvent } from '../tracking';

/**
 * Track when a component mounts
 */
export const useTrackMount = (eventName: string, properties?: { [key: string]: any }) => {
  useEffect(() => {
    trackEvent(eventName, properties);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * Track page view when component mounts
 */
export const useTrackPageView = (pageName: string, properties?: { [key: string]: any }) => {
  useEffect(() => {
    trackEvent('page_view', {
      page_name: pageName,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      ...properties
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * Track when component unmounts
 */
export const useTrackUnmount = (eventName: string, properties?: { [key: string]: any }) => {
  useEffect(() => {
    return () => {
      trackEvent(eventName, properties);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};
