# Admin Guide: FADFAAD

## Accessing the Dashboard

- **URL:** [https://fdfad.vercel.app/admin](https://fdfad.vercel.app/admin)
- **Login:** Requires authenticated admin credentials managed via Supabase Auth.

## Order Management

1. **Overview:** The dashboard displays real-time metrics and the latest orders.
2. **Status Transitions:** Orders follow a specific lifecycle:
   - `NEW`: Default for new orders.
   - `CONFIRMED`: Customer details verified.
   - `PREPARING`: Items being packed.
   - `SHIPPED`: Out for delivery.
   - `DELIVERED`: Fulfillment complete.
   - `CANCELLED`: Order voided.
3. **Updating Status:** Use the `StatusPill` dropdown on the Order Detail page (accessible on both mobile and desktop).

## Product Management

1. **Adding Products:** Navigate to `Products` -> `Add Product`.
2. **Details:** Provide Title, Slug, Description, Price, Fabric Type, and Opacity Scale.
3. **Categorization:** Every product must be assigned a primary category.
4. **Visibility:** Products can be toggled between `Active` and `Archived`.

## Category Management

- Manage product categories under the `Categories` tab.
- Categories use an **Archive Strategy**—hide categories from the storefront instead of deleting them to preserve historical data.

## Localization

- The interface supports both **Arabic** and **English**.
- Toggle languages using the globe icon in the header.
- Arabic uses the `Cairo` font with RTL directionality.
