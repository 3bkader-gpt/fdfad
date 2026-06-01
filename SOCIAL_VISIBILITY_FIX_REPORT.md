# Social Visibility UI Fix Report

**Date:** June 1, 2026
**Status:** Fixed and Deployed

## 1. Issue Description
- **Bug:** The social media icons inside the `SocialFollow` component were rendering with poor contrast, causing them to blend into the background in both Light and Dark themes. Additionally, the social channel labels (e.g., "WhatsApp", "Instagram") were completely hidden until hovered, violating the requirement for immediate user recognition.
- **Impact:** Poor accessibility and reduced conversion to social channels, particularly on mobile devices where hover states do not naturally exist.

## 2. Audit Findings
- **Icon Colors:** The icons were inheriting an implicit fill color that failed to contrast against the dynamic `--bg-elevated` background.
- **Text Visibility:** The original extracted CSS heavily relied on `opacity: 0` and `width: 52px` to hide the label text at rest, revealing it only during a `:hover` width expansion.
- **Theme Inheritance:** The dark theme `--bg-elevated` value (`#1A1A1A`) and light theme value (`#FFFFFF`) required a dynamic text/icon color (`--text-primary`) to remain legible before the vibrant brand backgrounds kick in on hover.

## 3. Implementation Details
- **CSS Overrides (`globals.css`):**
  - **Button Shape:** Transformed the resting state of `.social-expand-btn` from a `52x52px` circle to a visible pill (`width: auto`, `min-width: 160px`, `padding: 0 24px`).
  - **Color Inheritance:** Explicitly assigned `color: var(--text-primary)` to `.social-expand-btn`, `.social-expand-icon`, and `.social-expand-text` at rest.
  - **Text Visibility:** Changed the resting `.social-expand-text` styles to `opacity: 1` and `transform: translateX(0)`, making labels permanently readable.
  - **Hover Interaction:** Maintained the luxury brand color fills (e.g., WhatsApp Green), icon rotation, and a translation jump (`translateY(-4px)`), while enforcing `#fff` text/icon color during the hover/active states for maximum contrast.

## 4. Verification
- **Light Theme:** Icons and text appear as dark evergreen (`#2C3E35`) against a pure white background.
- **Dark Theme:** Icons and text appear as soft white (`#FAFAFA`) against a dark elevated background (`#1A1A1A`).
- **Interaction:** Labels are permanently legible, fulfilling the requirement for immediate channel recognition without hover dependency.

---
**Mission Outcome:** The social buttons are now fully accessible and readable across all devices and themes, while retaining their high-end interactive animations.
