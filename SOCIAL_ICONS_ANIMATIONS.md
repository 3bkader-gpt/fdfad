# Social Media Icons Animations: Nest Burger

This document details the animations and interactive effects for the social media icon buttons located in the "Follow Us / تابعنا" section of the Nest Burger project.

## 1. Implementation Overview

The social icons feature a sophisticated "expanding button" effect implemented using **Pure CSS** transitions and **Tailwind CSS** for layout.

### Animations Included:
- **Hover Expansion:** Buttons expand from a circle (48px) to a wide pill (160px).
- **Lifting Effect:** Buttons move upward (`translateY`) on hover.
- **Icon Rotation:** The SVG icon rotates 360 degrees on hover.
- **Text Slide & Fade:** Label text slides in from the left and fades in.
- **Dynamic Glow:** Context-aware box-shadows (WhatsApp green, Facebook blue, Instagram gradient) appear on hover.
- **Color Transitions:** Background and border colors transition smoothly.

---

## 2. Component Code

### 2.1 Component Structure (`src/components/Footer.tsx`)

```tsx
"use client";

import { WHATSAPP_URL, FACEBOOK_URL, INSTAGRAM_URL } from "@/data/site";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./ui/Icons";

export function SocialButtons() {
  return (
    <div className="flex gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="social-expand-btn social-whatsapp"
      >
        <WhatsAppIcon className="social-expand-icon" />
        <span className="social-expand-text">WhatsApp</span>
      </a>
      
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="social-expand-btn social-instagram"
      >
        <InstagramIcon className="social-expand-icon" />
        <span className="social-expand-text">Instagram</span>
      </a>
      
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="social-expand-btn social-facebook"
      >
        <FacebookIcon className="social-expand-icon" />
        <span className="social-expand-text">Facebook</span>
      </a>
    </div>
  );
}
```

### 2.2 SVG Icons (`src/components/ui/Icons.tsx`)

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

export function FacebookIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
```

---

## 3. Animation Styles (`src/app/globals.css`)

Copy these styles into your global CSS file to enable the animations.

```css
/* Container and Shared Transitions */
.social-expand-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 48px;
  width: 48px; /* Initial state: Circle */
  padding: 0 14px;
  border-radius: 50px;
  color: #888888; /* footer-muted color */
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  white-space: nowrap;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8125rem;
  /* Complex easing for elastic feel */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Hover State: Expanding and Lifting */
.social-expand-btn:hover {
  width: 160px; /* Expanded state: Pill */
  color: #fff;
  transform: translateY(-5px);
}

/* Icon Animation: Rotation */
.social-expand-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.social-expand-btn:hover .social-expand-icon {
  transform: rotate(360deg);
}

/* Text Animation: Slide and Fade */
.social-expand-text {
  opacity: 0;
  transform: translateX(-12px);
  transition: all 0.4s ease;
}

.social-expand-btn:hover .social-expand-text {
  opacity: 1;
  transform: translateX(0);
}

/* WhatsApp Specific: Green Glow */
.social-whatsapp:hover {
  background: #25D366;
  border-color: #25D366;
  color: #fff;
  box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3),
              0 0 15px rgba(37, 211, 102, 0.15);
}

/* Instagram Specific: Brand Gradient and Pink Glow */
.social-instagram:hover {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 10px 20px rgba(188, 24, 136, 0.3),
              0 0 15px rgba(225, 48, 108, 0.15);
}

/* Facebook Specific: Blue Glow */
.social-facebook:hover {
  background: #1877F2;
  border-color: #1877F2;
  color: #fff;
  box-shadow: 0 10px 20px rgba(24, 119, 242, 0.3),
              0 0 15px rgba(24, 119, 242, 0.15);
}
```

---

## 4. Dependencies & Setup

1.  **Tailwind CSS:** Required for utility classes (`flex`, `gap-3`, etc.).
2.  **Next.js:** Used for the component framework, but the CSS is portable to any React or HTML environment.
3.  **Cairo Font (Optional):** The project uses the Cairo font for Arabic/English harmony, which complements the bold weight of the labels.

### Usage Instructions:
1.  Place the SVG components in your icons directory.
2.  Add the CSS rules to your global stylesheet.
3.  Implement the JSX structure in your component.
4.  The animations will trigger automatically on hover thanks to the CSS `transition` and `:hover` selectors.
