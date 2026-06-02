# Entity Relationship Diagram (ERD): FADFAAD

```mermaid
erDiagram
    admins {
        uuid id PK
        text email UK
        timestamptz created_at
    }

    products {
        uuid id PK
        text title
        text slug UK
        text description
        numeric price
        int opacity_scale
        text fabric_type
        boolean made_in_egypt
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    product_images {
        uuid id PK
        uuid product_id FK
        text url
        text alt_text
        int display_order
        timestamptz created_at
    }

    orders {
        uuid id PK
        text order_no UK
        text customer_name
        text phone_number
        text governorate
        text address
        text notes
        numeric total_amount
        text status
        timestamptz created_at
        timestamptz updated_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        numeric price_at_purchase
        timestamptz created_at
    }

    products ||--o{ product_images : "has many"
    orders ||--|{ order_items : "contains"
    products ||--o{ order_items : "included in"
```

## Data Lifecycle Summary

1.  **Product Management:** Admin creates a `product`. They upload one or more `product_images` linked via `product_id`.
2.  **Order Placement:** Customer (Anonymous) selects products. A record is inserted into `orders` (triggering the `FDF-` sequence).
3.  **Order Line Items:** Each item selected is inserted into `order_items`. `price_at_purchase` is captured to ensure the order record remains accurate if the main `products` price is updated later.
4.  **Admin Fulfillment:** Admin logs in and updates the `orders.status`.
