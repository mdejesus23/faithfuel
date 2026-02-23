import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({
    pattern: '*/index.json',
    base: './src/data/products',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      price: z.number(),
      images: z.array(image()),
      sizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])),
      category: z.string(),
      seller: z.string(),
      featured: z.boolean().default(false),
      inStock: z.boolean().default(true),
      tags: z.array(z.string()).optional(),
    }),
});

export const collections = { products };
