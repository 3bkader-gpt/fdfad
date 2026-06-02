# Visual System for فضفاض

This document defines the foundational UI/UX visual language for the فضفاض ecommerce experience. Every decision is rooted in conversion optimization (CRO) principles and modest fashion industry standards.

## 1. Color Palette

- **Primary Background:** `#FAFAFA` (Off-White/Pearl).
  - _Why:_ Pure `#FFFFFF` can cause eye strain on mobile screens. Off-white provides a softer, more elegant canvas that allows product photography to pop without harsh contrast.
- **Primary Text & High-Emphasis UI:** `#2C3E35` (Deep Forest/Charcoal Green).
  - _Why:_ A softer alternative to harsh black (`#000000`). It aligns with the modest, earthy vibe while maintaining high accessibility contrast ratios for readability.
- **Primary Action (CTA Buttons):** `#C89B7E` (Warm Terracotta/Muted Clay).
  - _Why:_ Earth tones are synonymous with modern modest fashion. This color stands out against the off-white background drawing the eye for conversions (Add to Cart, Checkout) without screaming "SALE."
- **Secondary Action / Borders:** `#E5D9D0` (Soft Sand).
  - _Why:_ Used for secondary buttons (e.g., "View Details"), input borders, and dividers. Keeps the interface clean and subtle.
- **Success / Trust Signals:** `#4A7C59` (Muted Emerald).
  - _Why:_ Used for "In Stock," "Verified Review," or "Free Shipping" badges. Green universally signals safety and success.
- **Error / Urgency:** `#A34A4A` (Faded Brick).
  - _Why:_ Used for "Out of Stock" or form errors. Less aggressive than pure red, maintaining the premium feel even during friction points.

## 2. Typography

- **Headings (H1, H2, Titles):** `Playfair Display` (Serif).
  - _Why:_ Serifs communicate heritage, elegance, and high editorial quality. It immediately elevates the brand above generic dropshipping stores.
- **Body & UI Elements (Navigation, Buttons, Descriptions):** `Inter` or `Tajawal` (for Arabic) (Sans-serif).
  - _Why:_ Exceptional legibility on small mobile screens. Clean geometry balances the ornate serif headings. Crucial for clear navigation and policy reading.

## 3. Spacing & Grid System (Mobile First)

- **Grid:** 4-column fluid grid. Margins: `16px`, Gutter: `12px`.
- **Spacing Scale:** 8-point system (8, 16, 24, 32, 48, 64px).
  - _Why:_ Creates a predictable, harmonious vertical rhythm.
- **Touch Targets:** Minimum `44x44px` for all interactive elements.
  - _Why:_ Apple and Google interface guidelines mandate this to prevent accidental mis-taps on mobile devices, reducing user frustration.

## 4. Component Styles

### Buttons

- **Primary CTA:** Full width (on mobile), Solid Fill (`#C89B7E`), Text (`#FFFFFF`), Border Radius `4px` or `8px` (slightly rounded, not pill-shaped).
  - _Why:_ Full-width buttons on mobile are easier to tap with a thumb. Slight rounding feels modern and approachable compared to sharp 90-degree corners.
- **Secondary CTA:** Outline style. Border (`#2C3E35`), Text (`#2C3E35`), Transparent background.

### Inputs & Forms

- **Style:** Minimalist. Bottom-border only (Material style) OR lightly outlined boxes with a soft background (`#F5F5F5`).
- **Labels:** Floating labels or clearly positioned above the input.
  - _Why:_ Floating labels save vertical space on mobile while ensuring context isn't lost when typing.

### Product Cards

- **Image Ratio:** `3:4` or `4:5` (Portrait).
  - _Why:_ Fashion is vertical. Portrait ratios show more of the garment (crucial for long items like Abayas and Jilbabs) and take up more screen real estate, increasing engagement.
- **Structure:** Image -> Subtle "Quick Add" icon -> Brand Name (small) -> Product Title -> Price.
- **Shadows:** None or extremely subtle (`0px 4px 12px rgba(0,0,0,0.03)`).
  - _Why:_ Flat design feels more editorial and premium. Heavy shadows look dated.

## 5. Photography Direction

- **Lighting:** Natural, soft, diffused light. Avoid harsh studio flashes.
- **Context:** Mix of studio shots (clean background for detail) and lifestyle shots (showing the garment in motion, e.g., walking, to demonstrate drape and fabric flow).
- **Focus:** Detail shots are mandatory. Close-ups of the fabric texture, seams, and opacity (e.g., holding a hand behind a chiffon hijab to show transparency).
  - _Why:_ In modest fashion, fabric weight, drape, and opacity are the primary purchasing criteria. Photography must answer these questions visually.
- **Cropping:** Ensure the full length of the garment is visible in at least one shot per product.

## 6. Iconography

- **Style:** Line icons, 1.5px stroke weight, rounded caps.
  - _Why:_ Consistent, lightweight icons don't distract from the photography but provide necessary wayfinding cues (Cart, Search, Menu, Filter).
