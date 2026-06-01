'use client';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

type Theme = 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

let themeListeners: Array<() => void> = [];
function subscribeTheme(cb: () => void) {
  themeListeners = [...themeListeners, cb];
  return () => {
    themeListeners = themeListeners.filter((l) => l !== cb);
  };
}

function getThemeSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as Theme) === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Explicitly type the store to ensure correct inference
  const theme = useSyncExternalStore<Theme>(subscribeTheme, getThemeSnapshot, () => 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    themeListeners.forEach((l) => l());
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
