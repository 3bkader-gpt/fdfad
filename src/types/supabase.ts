export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
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
    };
    Views: {
      [_ in string]: {
        Row: {
          [_ in string]: Json | undefined;
        };
      };
    };
    Functions: {
      [_ in string]: {
        Args: {
          [_ in string]: Json | undefined;
        };
        Returns: Json | undefined;
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
