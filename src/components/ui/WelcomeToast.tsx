'use client';

import { useEffect, useState } from 'react';
import { Toast } from './Toast';
import { useTranslations } from 'next-intl';

export function WelcomeToast() {
  const [show, setShow] = useState(false);
  const t = useTranslations('Common');

  useEffect(() => {
    // Only run on client
    const hasVisited = localStorage.getItem('fadfaad_visited');
    if (!hasVisited) {
      // Small delay to let page load first
      const timer = setTimeout(() => {
        setShow(true);
        localStorage.setItem('fadfaad_visited', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <Toast
      message={t('welcomeMessage') || 'Welcome to Fadfaad. Discover the art of modest drapery.'}
      type="success"
      onClose={() => setShow(false)}
      duration={8000}
    />
  );
}
