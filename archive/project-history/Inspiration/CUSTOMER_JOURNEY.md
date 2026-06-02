# Customer Journey Map: The فضفاض Experience

This document maps the end-to-end customer journey, identifying potential friction points, trust hurdles, and conversion opportunities specifically for the Egyptian mobile shopper.

## Phase 1: Discovery (Instagram Ad)

- **User Action:** Sees a targeted ad for a new summer Abaya collection.
- **Mindset:** "That looks elegant, but is it actually opaque? Is this a real brand or a scam page?"
- **Friction Points:** If the ad directs to a WhatsApp number instead of a site, anxiety increases. If the site loads slowly (>3s), they bounce immediately.
- **Conversion Opportunity:** Ensure the landing page directly matches the ad content (scent trail). The first thing they see must be the product from the ad.

## Phase 2: Landing & Exploration (Homepage / Collection Page)

- **User Action:** Lands on the website, scrolls to see what else is available.
- **Mindset:** "Do they have my size? What is the price range? How do I filter out the styles I don't wear?"
- **Friction Points:** Hidden prices, clunky mobile menus, lack of filtering options (e.g., "Maxi length", "Summer fabric").
- **Conversion Opportunity:** Implement a "Quick Add" button directly on product cards for repeat buyers. Use high-contrast "New Arrival" or "Bestseller" badges to guide attention.

## Phase 3: Evaluation (Product Page)

- **User Action:** Clicks on a specific Abaya to view details.
- **Mindset:** "I need to know the fabric type. Will it shrink? Can I see it on a person? Do they accept Cash on Delivery (COD)?"
- **Friction Points:** Vague fabric descriptions. No size chart. High shipping costs revealed late.
- **Conversion Opportunity:**
  - **Trust Signals:** Place "Free Shipping over X" and "Cash on Delivery Available" directly beneath the price.
  - **Information Architecture:** Use accordions for "Fabric & Care" and "Shipping & Returns" to keep the mobile view clean.
  - **Sticky CTA:** The "Add to Cart" button must stick to the bottom of the screen as they scroll.

## Phase 4: Intent (Cart / Drawer Cart)

- **User Action:** Taps "Add to Cart."
- **Mindset:** "Okay, let's see the total. Should I buy an undercap to match?"
- **Friction Points:** Redirecting to a slow `/cart` page instead of a slide-out drawer breaks the shopping flow.
- **Conversion Opportunity:** Use a Slide-Out Cart (Drawer). Include a subtle progress bar ("You are X EGP away from Free Shipping!"). Add a one-click upsell for related small items (matching hijabs, scrunchies, pins).

## Phase 5: Commitment (Checkout)

- **User Action:** Proceeds to checkout to enter details.
- **Mindset:** "I hope this is secure. I don't want to create an account."
- **Friction Points:** Forced account creation. Complicated address fields (Egyptian addresses can be messy). Hidden fees appearing at the final step.
- **Conversion Opportunity:**
  - Enable Guest Checkout by default.
  - Use a clean, accordion-style or single-page checkout.
  - Visually highlight "Cash on Delivery" as a primary option, as it is the preferred method in Egypt.

## Phase 6: Post-Purchase (Order Confirmation & Tracking)

- **User Action:** Completes purchase and lands on the success page.
- **Mindset:** "Did it go through? When will it arrive?"
- **Friction Points:** Lack of immediate confirmation email or SMS. Vague delivery timelines.
- **Conversion Opportunity:** The "Thank You" page should clearly state the expected delivery window. Offer a WhatsApp button _here_ for order tracking or modifications (turning WhatsApp into a retention tool, not a sales crutch).

## Phase 7: Retention (WhatsApp Follow-up & Repeat Purchase)

- **User Action:** Receives the item.
- **Mindset:** "The packaging is nice. It fits well. I will buy from them again."
- **Friction Points:** Poor unboxing experience. Difficult return process if it doesn't fit.
- **Conversion Opportunity:** Automate a WhatsApp message 3 days after delivery asking for a photo review in exchange for a 10% discount on the next order. This builds the UGC library (crucial for Phase 3) and drives repeat purchases.
