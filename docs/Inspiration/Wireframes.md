# Mobile-First Wireframe Specifications (390 × 844)

These wireframes define the structural hierarchy and UX rationale for the فضفاض platform, strictly prioritizing the mobile viewport.

---

## 1. Homepage

**Goal:** Establish brand trust instantly and route users to collections quickly.

*   **[Header]**
    *   Hamburger Menu (Left) | Logo (Center) | Search & Cart Icon (Right)
    *   *Sticky on scroll up.*
*   **[Announcement Bar]**
    *   "Free Shipping over 1000 EGP | Cash on Delivery Available"
*   **[Hero Section]**
    *   Full-width lifestyle video or high-res image (Portrait ratio).
    *   Overlay text: "The Summer Modesty Collection"
    *   Primary CTA: "Shop the Collection" (Solid button, bottom center).
*   **[Category Navigation (Horizontal Scroll)]**
    *   Circle icons + Text: Hijabs, Abayas, Khimars, Sets, Accessories.
    *   *Rationale:* Faster routing than opening the hamburger menu.
*   **[Value Proposition Bar]**
    *   3 Icons side-by-side: Secure Payment | Premium Fabrics | Easy Returns.
*   **[Trending Now (Carousel)]**
    *   2.5 product cards visible. Standard product card structure (Image, Title, Price, Quick Add).
*   **[Editorial Section]**
    *   Large image + Text: "How to style your Jilbab for work."
    *   CTA: "Read the Guide" (Builds authority).
*   **[Footer]**
    *   Email signup (10% off), Links (FAQ, Returns, Contact), Social Icons.

---

## 2. Collection Page (e.g., "Abayas")

**Goal:** Allow users to browse large inventories without fatigue.

*   **[Header]** Standard.
*   **[Page Title & Filter Bar]**
    *   H1: Abayas (Left)
    *   Buttons: "Filter" (Icon) | "Sort" (Dropdown) (Right)
    *   *Rationale:* Sticky filter bar ensures users can narrow choices without scrolling back up.
*   **[Active Filters (Chips)]**
    *   e.g., [x] Black [x] Linen [x] Maxi
*   **[Product Grid]**
    *   2 columns.
    *   Image (3:4 ratio).
    *   Color swatches (small circles).
    *   Title (truncated to 1 line).
    *   Price (Bold).
    *   "Quick Add" (Subtle outline button or plus icon).
*   **[Pagination/Infinite Scroll]**
    *   "Load More" button preferred over auto-infinite scroll to allow footer access.

---

## 3. Product Detail Page (PDP)

**Goal:** Answer every objection visually or textually to force the conversion.

*   **[Header]** Standard.
*   **[Image Gallery]**
    *   Full width, swipeable. Pagination dots.
    *   Must include: Full body, Fabric detail (macro), Video showing drape.
*   **[Product Info Header]**
    *   Title (H2).
    *   Price.
    *   Reviews summary (⭐⭐⭐⭐⭐ 42 Reviews).
*   **[Trust Badges]**
    *   Small row: 🚚 2-3 Day Delivery | 💳 Cash on Delivery | 🔄 14-Day Returns.
*   **[Variant Selector]**
    *   Colors: Visual swatches.
    *   Size: Pill buttons (S, M, L, XL). "Size Guide" link right-aligned.
*   **[Sticky 'Add to Cart' Bar]**
    *   *Fixed to bottom of screen.* Contains Price + Large Solid CTA.
*   **[Accordion Details]**
    *   [+] Product Description
    *   [+] Fabric & Care (Crucial: "Opaque", "Breathable Linen").
    *   [+] Model Measurements.
*   **[UGC / Review Section]**
    *   Photo gallery of customers wearing the item.
*   **[Related Products]**
    *   "Complete the Look" (Cross-sell: matching hijabs).

---

## 4. Slide-Out Cart (Drawer)

**Goal:** Keep the user in the shopping context while incentivizing higher AOV.

*   **[Header]** "Your Cart (2)" | Close (X) icon.
*   **[Progress Bar]**
    *   "You are 200 EGP away from Free Shipping!" (Visual fill bar).
*   **[Cart Items List]**
    *   Thumbnail | Title | Variant | Qty Selector (+/-) | Price | Remove (Trash icon).
*   **[Upsell Module]**
    *   "Perfect Match:" Small horizontal scroll of low-ticket items (Pins, Undercaps). 1-click add.
*   **[Footer (Sticky)]**
    *   Subtotal.
    *   Primary CTA: "Checkout Securely".

---

## 5. Checkout (Optimized Flow)

**Goal:** Absolute minimal friction.

*   **[Header]** Simplified (No navigation links to prevent exiting the funnel). Logo only.
*   **[Express Checkout]**
    *   Apple Pay / Google Pay buttons (if applicable).
    *   Divider: "OR".
*   **[Contact Info]**
    *   Email or Mobile Phone Number.
*   **[Shipping Address]**
    *   Auto-detect governorate/city if possible.
*   **[Delivery Method]**
    *   Standard Delivery (50 EGP).
*   **[Payment Method]**
    *   [Radio] Cash on Delivery (Pre-selected, highest conversion in Egypt).
    *   [Radio] Credit/Debit Card.
*   **[Order Summary (Accordion)]**
    *   Collapsed by default to save space, shows total only.
*   **[Sticky CTA]**
    *   "Place Order - [Total Price]" (Solid, full width).

---

## 6. Order Tracking / Success Page

**Goal:** Reduce post-purchase anxiety and support tickets.

*   **[Status Graphic]**
    *   Large green checkmark. "Order Confirmed!"
*   **[Order Details]**
    *   Order #12345.
*   **[Delivery Expectation]**
    *   "Your order will arrive between [Date] and [Date]."
*   **[Next Steps]**
    *   "We will send you an SMS when your order is out for delivery."
*   **[Support Action]**
    *   "Need to change something?" -> WhatsApp Support Button.
