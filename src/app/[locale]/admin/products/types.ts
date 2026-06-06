import * as z from 'zod';

export const productSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z
    .string()
    .min(3, 'Slug is required')
    .regex(/^[\w\u0600-\u06FF0-9-]+$/, 'Slug must be URL-friendly'),
  description: z.string().optional(),
  price: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) >= 0, 'Invalid price'),
  opacity_scale: z.string().optional(),
  fabric_type: z.string().optional(),
  made_in_egypt: z.string(),
  is_active: z.string(),
  category_id: z.string().min(1, 'Category is required'),
  garment_length_cm: z.string().optional(),
  season: z.string().optional(),
  care_instructions: z.string().optional(),
  model_height_cm: z.string().optional(),
  model_weight_kg: z.string().optional(),
  model_size_worn: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
