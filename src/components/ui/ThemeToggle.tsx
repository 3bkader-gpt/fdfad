'use client';
import { useTheme } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label className="theme-switch focus-within:ring-brand-accent/30 rounded-full outline-none focus-within:ring-1">
      <span className="sr-only">{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
      <input
        type="checkbox"
        className="theme-switch__input"
        checked={isDark}
        onChange={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      />

      <div className="theme-switch__track">
        {/* Night Elements */}
        <div className="theme-switch__stars" />

        {/* Day Elements */}
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
