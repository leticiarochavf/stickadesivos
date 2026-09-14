import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export function NuvemshopFrameResize() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || window.parent === window) return;

    const sendHeight = () => {
      const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      window.parent.postMessage({ type: 'resize', height }, process.env.EXPO_PUBLIC_NUVEMSHOP_ORIGIN || 'https://www.stickadesivos.com.br');
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(sendHeight);
    observer?.observe(document.documentElement);
    sendHeight();
    window.addEventListener('resize', sendHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', sendHeight);
    };
  }, []);

  return null;
}
