'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="theme-switch focus-within:ring-brand-accent/30 rounded-full outline-none focus-within:ring-1"
        style={{ visibility: 'hidden' }}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <label className="theme-switch focus-within:ring-brand-accent/30 rounded-full outline-none focus-within:ring-1">
      <span className="sr-only">{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
      <input
        type="checkbox"
        className="theme-switch__input"
        checked={isDark}
        onChange={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle theme"
      />
      <div className="theme-switch__track">
        {/* Stars Background */}
        <div className="theme-switch__stars" />

        {/* Clouds */}
        <div className="theme-switch__clouds">
          <div className="cloud cloud--1" />
          <div className="cloud cloud--2" />
        </div>

        {/* Sun/Moon Orb */}
        <div className="theme-switch__orb">
          <div className="crater crater--1" />
          <div className="crater crater--2" />
        </div>
      </div>
    </label>
  );
}
