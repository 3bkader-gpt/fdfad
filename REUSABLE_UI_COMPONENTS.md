# Reusable UI Components Extraction: Nest Burger

This document contains the complete implementation of the **Navigation Bar**, **Dark Mode Toggle**, and **Language Switcher** from the Nest Burger project. These components are designed to work together within a Next.js (React 19) environment using Tailwind CSS and GSAP.

## 1. Installation Requirements

To use these components in a new project, install the following dependencies:

```bash
npm install gsap @fontsource/cairo
```

Ensure you have **Tailwind CSS v4** (or v3 with appropriate configuration) and **Next.js** set up.

---

## 2. Shared Dependencies

### 2.1 Icons (`src/components/ui/Icons.tsx`)
Required for the Navigation Bar (Menu/Close icons) and general UI.

```tsx
interface IconProps {
  className?: string;
}

export function WhatsAppIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function CloseIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function MenuIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
```

### 2.2 Site Data (`src/data/site.ts`)
Contains shared links and constants.

```ts
export const WHATSAPP_URL = "https://wa.me/201006973278";
```

### 2.3 Global Styles (`src/app/globals.css`)
Contains theme variables and specialized animations for the Theme Toggle.

```css
@import "tailwindcss";

:root {
  --brand-yellow: #F4C21F;
  --brand-yellow-light: #FFD84D;
  --brand-black: #111111;
  --bg-main: #0F0F0F;
  --bg-elevated: #242424;
  --text-primary: #FFFFFF;
  --text-secondary: #CFCFCF;
  --border-color: #2A2A2A;
}

.light {
  --bg-main: #FAF5E8;
  --bg-elevated: #F5F0E4;
  --text-primary: #111111;
  --text-secondary: #333333;
  --border-color: #E0D8C8;
}

/* Floating dock styles */
.nest-dock-shell {
  border: 1px solid color-mix(in srgb, var(--border-color) 82%, var(--bg-elevated));
  background: color-mix(in srgb, var(--bg-main) 88%, transparent);
  backdrop-filter: blur(18px) saturate(125%);
}

.nest-dock-highlight {
  height: calc(100% - 0.5rem);
  border-radius: 999px;
  background: linear-gradient(135deg, var(--brand-yellow), var(--brand-yellow-light));
  box-shadow: 0 4px 16px rgba(244, 194, 31, 0.25);
}

/* Theme Toggle Animations (Simplified for extraction) */
.theme-toggle {
  --tg-w: 72px; --tg-h: 32px; --tg-pad: 3px;
  position: relative; display: inline-flex; width: var(--tg-w); height: var(--tg-h); cursor: pointer;
  border-radius: 999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.08);
}
.theme-toggle__input { appearance: none; position: absolute; opacity: 0; }
.theme-toggle__track {
  position: absolute; inset: var(--tg-pad); border-radius: 999px; background: #1a1a2e; overflow: hidden; transition: background 0.6s ease;
}
.theme-toggle__input:checked ~ .theme-toggle__track { background: #78B9E2; }
.theme-toggle__orb {
  position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; border-radius: 50%; background: #e2e8f0;
  transition: transform 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.theme-toggle__input:checked ~ .theme-toggle__track .theme-toggle__orb {
  transform: translateX(40px); background: var(--brand-yellow);
}
```

---

## 3. Dark Mode Toggle Implementation

### 3.1 Theme Provider (`src/providers/ThemeProvider.tsx`)

```tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

type Theme = "dark" | "light";
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType>({ theme: "dark", toggleTheme: () => {} });

let themeListeners: Array<() => void> = [];
function subscribeTheme(cb: () => void) {
  themeListeners = [...themeListeners, cb];
  return () => { themeListeners = themeListeners.filter((l) => l !== cb); };
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    themeListeners.forEach((l) => l());
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
```

### 3.2 Theme Toggle Component (`src/components/ui/ThemeToggle.tsx`)

```tsx
"use client";
import { useTheme } from "@/providers/ThemeProvider";
import { useLang } from "@/i18n/context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  const isLight = theme === "light";

  return (
    <label className="theme-toggle" aria-label={isLight ? t.theme.dark : t.theme.light}>
      <input type="checkbox" className="theme-toggle__input" checked={isLight} onChange={toggleTheme} />
      <div className="theme-toggle__track">
        <div className="theme-toggle__orb" />
      </div>
    </label>
  );
}
```

---

## 4. Language Switcher Implementation

### 4.1 Language Context (`src/i18n/context.tsx`)

```tsx
"use client";
import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { ar } from "./ar";
import { en } from "./en";

export type Locale = "ar" | "en";
export type Translations = typeof ar;
interface LangContextType { locale: Locale; t: Translations; toggleLocale: () => void; dir: "rtl" | "ltr"; }
const LangContext = createContext<LangContextType>({ locale: "ar", t: ar, toggleLocale: () => {}, dir: "rtl" });

const translations = { ar, en };
let localeListeners: Array<() => void> = [];
function subscribeLocale(cb: () => void) {
  localeListeners = [...localeListeners, cb];
  return () => { localeListeners = localeListeners.filter((l) => l !== cb); };
}

function getLocaleSnapshot(): Locale {
  if (typeof window === "undefined") return "ar";
  return localStorage.getItem("lang") === "en" ? "en" : "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, getLocaleSnapshot, () => "ar");

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const toggleLocale = useCallback(() => {
    const next = locale === "ar" ? "en" : "ar";
    localStorage.setItem("lang", next);
    localeListeners.forEach((l) => l());
  }, [locale]);

  return (
    <LangContext.Provider value={{ locale, t: translations[locale], toggleLocale, dir: locale === "ar" ? "rtl" : "ltr" }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
```

### 4.2 Language Toggle Component (`src/components/ui/LanguageToggle.tsx`)

```tsx
"use client";
import { useLang } from "@/i18n/context";

export function LanguageToggle() {
  const { locale, toggleLocale } = useLang();
  return (
    <button onClick={toggleLocale} className="px-3 py-2.5 min-h-[44px] rounded-full text-sm font-bold bg-bg-elevated hover:bg-brand-yellow/20 text-text-primary transition-colors duration-200">
      {locale === "ar" ? "EN" : "عربي"}
    </button>
  );
}
```

---

## 5. Navigation Bar Implementation

### 5.1 Main Header (`src/components/Header.tsx`)

```tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useLang } from "@/i18n/context";
import { ThemeToggle } from "./ui/ThemeToggle";
import { LanguageToggle } from "./ui/LanguageToggle";
import { WHATSAPP_URL } from "@/data/site";
import { CloseIcon, MenuIcon } from "./ui/Icons";

const navLinks = [
  { key: "bestSellers", href: "#best-sellers" },
  { key: "menu", href: "#menu" },
  { key: "testimonials", href: "#testimonials" },
  { key: "branches", href: "#branches" },
] as const;

export function Header() {
  const { t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dockVisible, setDockVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const dockInnerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const lastScrollY = useRef(0);

  // Scroll visibility logic
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setDockVisible(currentY <= lastScrollY.current || currentY <= 120);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sliding pill animation
  const slidePillTo = useCallback((link: HTMLAnchorElement | null) => {
    if (!highlightRef.current || !dockInnerRef.current || !link) return;
    const navRect = dockInnerRef.current.getBoundingClientRect();
    const itemRect = link.getBoundingClientRect();
    gsap.to(highlightRef.current, {
      x: itemRect.left - navRect.left,
      width: itemRect.width,
      autoAlpha: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  }, []);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg-main/90 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2"><span className="font-bold text-brand-yellow">Nest Burger</span></div>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LanguageToggle />
            <button onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <CloseIcon /> : <MenuIcon />}</button>
          </div>
        </div>
      </header>

      {/* Desktop Floating Dock */}
      <div className={`fixed inset-x-0 bottom-6 z-[60] hidden md:flex justify-center transition-transform duration-300 ${dockVisible ? "translate-y-0" : "translate-y-[130%]"}`}>
        <div ref={dockInnerRef} className="nest-dock-shell relative flex items-center gap-1 rounded-full px-2 py-1.5 shadow-2xl">
          <div ref={highlightRef} className="nest-dock-highlight absolute top-1 invisible pointer-events-none" style={{ width: 0 }} />
          {navLinks.map((link, i) => (
            <a key={link.key} ref={(el) => { linkRefs.current[i] = el; }} href={link.href} className="relative z-10 px-4 py-2 text-sm font-semibold text-text-secondary hover:text-text-primary">
              {t.nav[link.key]}
            </a>
          ))}
          <a href={WHATSAPP_URL} className="bg-brand-yellow text-brand-black px-5 py-2 rounded-full font-bold text-sm">Order Now</a>
        </div>
      </div>
    </>
  );
}
```

---

## 6. Integration Guide

To connect these components, wrap your root layout with the providers:

```tsx
// src/app/layout.tsx
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/i18n/context";
import { Header } from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Header />
        <main>{children}</Header>
      </ThemeProvider>
    </LanguageProvider>
  );
}
```

### File Connections Summary:
1. **Header.tsx** imports `ThemeToggle` and `LanguageToggle`.
2. **ThemeToggle** depends on `ThemeProvider` context.
3. **LanguageToggle** depends on `LanguageProvider` context.
4. **Globals.css** provides the CSS variables and specific class styles (glassmorphism, animations) used by all components.
5. **GSAP** is used in `Header.tsx` for the interactive "dock" animations.
