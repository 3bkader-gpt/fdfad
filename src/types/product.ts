import { Product as SupabaseProduct } from './supabase';

export interface SizeRecommendationItem {
  size: string;
  weight_range: string;
}

export interface ProductImageItem {
  url: string;
  is_cover: boolean;
}

export type ProductWithRelations = SupabaseProduct;
