export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OrderStatus = 'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          name_ar: string;
          name_en: string;
          description_ar: string | null;
          description_en: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          name_ar: string;
          name_en: string;
          description_ar?: string | null;
          description_en?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          name_ar?: string;
          name_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
        };
      };
      product_categories: {
        Row: {
          product_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          product_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          product_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          price: number;
          opacity_scale: number;
          fabric_type: string;
          made_in_egypt: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          sizes: string[];
          colors: string[];
          garment_length_cm: number | null;
          season: string | null;
          care_instructions: string | null;
          model_height_cm: number | null;
          model_weight_kg: number | null;
          model_size_worn: string | null;
          size_recommendations: Json;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          price: number;
          opacity_scale: number;
          fabric_type: string;
          made_in_egypt?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          sizes?: string[];
          colors?: string[];
          garment_length_cm?: number | null;
          season?: string | null;
          care_instructions?: string | null;
          model_height_cm?: number | null;
          model_weight_kg?: number | null;
          model_size_worn?: string | null;
          size_recommendations?: Json;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          opacity_scale?: number;
          fabric_type?: string;
          made_in_egypt?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          sizes?: string[];
          colors?: string[];
          garment_length_cm?: number | null;
          season?: string | null;
          care_instructions?: string | null;
          model_height_cm?: number | null;
          model_weight_kg?: number | null;
          model_size_worn?: string | null;
          size_recommendations?: Json;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          created_at: string;
          is_cover: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
          is_cover?: boolean;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
          is_cover?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_no: string;
          customer_name: string;
          phone_number: string;
          governorate: string;
          address: string;
          notes: string | null;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_no?: string;
          customer_name: string;
          phone_number: string;
          governorate: string;
          address: string;
          notes?: string | null;
          total_amount: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_no?: string;
          customer_name?: string;
          phone_number?: string;
          governorate?: string;
          address?: string;
          notes?: string | null;
          total_amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          quantity: number;
          price_at_purchase: number;
          created_at: string;
          selected_size: string | null;
          selected_color: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price_at_purchase: number;
          created_at?: string;
          selected_size?: string | null;
          selected_color?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          price_at_purchase?: number;
          created_at?: string;
          selected_size?: string | null;
          selected_color?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_order_rpc: {
        Args: {
          p_customer_name: string;
          p_phone_number: string;
          p_governorate: string;
          p_address: string;
          p_notes: string | null;
          p_total_amount: number;
        };
        Returns: Json;
      };
      update_order_status_rpc: {
        Args: {
          p_order_id: string;
          p_status: string;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
  };
}

// Helpers for joined queries
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
  product_categories?: {
    category_id: string;
    categories: Category | null;
  }[];
};

export type Order = Database['public']['Tables']['orders']['Row'] & {
  status: OrderStatus;
};
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: Database['public']['Tables']['products']['Row'] | null;
  })[];
};
