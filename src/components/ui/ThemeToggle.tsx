'use client';
import { useTheme } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label
      className="theme-switch"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <input
        type="checkbox"
        className="theme-switch__input"
        checked={isDark}
        onChange={toggleTheme}
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
