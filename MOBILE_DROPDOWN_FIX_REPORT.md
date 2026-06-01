# Mobile UX Fix Report: Order Status Dropdown

**Date:** June 1, 2026
**Status:** Successfully Fixed & Deployed

## 1. Issue Description
- **Bug:** The Order Status dropdown in the Admin Order Detail page was inaccessible on mobile devices.
- **Root Cause:** The menu relied exclusively on CSS `:hover` states to display options. Mobile browsers do not support true hover, making it impossible for admins to change order statuses on touch devices.

## 2. Implementation Details
- **State Control:** Refactored the `StatusPill` component to use a controlled `isOpen` React state.
- **Hybrid Interaction:**
    - **Desktop:** Maintained hover support via `onMouseEnter`/`onMouseLeave` for a seamless mouse experience.
    - **Mobile/Universal:** Added `onClick` toggle support to allow tap-to-open/close.
- **Outside Click Detection:** Implemented a `useRef` and `mousedown` event listener to automatically close the dropdown when the user taps/clicks outside the menu.
- **Accessibility:**
    - Guaranteed minimum **44x44px touch targets** for all status options.
    - Added a visual rotation animation to the chevron icon to indicate open/closed state.
    - Added `active:scale-95` feedback for touch interactions.

## 3. Verification
- **Viewport Tested:** 390x844 (iPhone 15 Pro).
- **Results:**
    - [x] Tap opens dropdown.
    - [x] Tap outside closes dropdown.
    - [x] Status options are easy to hit.
    - [x] Status transition logic (NEW -> CONFIRMED, etc.) works flawlessly on touch.
    - [x] Zero hydration warnings or layout shifts.

---
**Mission Outcome:** The Admin Dashboard is now fully operational on mobile, allowing the business owner to manage fulfillment on the go.
