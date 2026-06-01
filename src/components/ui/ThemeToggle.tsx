'use client';
import { useTheme } from '@/providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <label
      className="theme-toggle"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <input
        type="checkbox"
        className="theme-toggle__input"
        checked={isDark}
        onChange={toggleTheme}
      />
      <div className="theme-toggle__track">
        <div className="theme-toggle__orb" />
      </div>
    </label>
  );
}
