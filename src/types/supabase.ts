export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

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
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          display_order?: number;
          created_at?: string;
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
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          quantity: number;
          price_at_purchase: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          quantity?: number;
          price_at_purchase?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in string]: {
        Row: {
          [_ in string]: Json | undefined;
        };
      };
    };
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
    };
    Enums: {
      [_ in string]: string;
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'] & {
  product_images: Database['public']['Tables']['product_images']['Row'][];
};

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderWithItems = Order & {
  order_items: (OrderItem & {
    products: Database['public']['Tables']['products']['Row'] | null;
  })[];
};
