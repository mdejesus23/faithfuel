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
      sizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'regular'])),
      category: z.string(),
      seller: z.string(),
      featured: z.boolean().default(false),
      inStock: z.boolean().default(true),
      tags: z.array(z.string()).optional(),
      date: z.string(),
    }),
});

const privacyPolicyCollection = defineCollection({
  loader: glob({
    pattern: 'index.md',
    base: './src/data/privacy',
    generateId: () => 'privacy',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
});

const shippingPolicyCollection = defineCollection({
  loader: glob({
    pattern: 'index.md',
    base: './src/data/shipping',
    generateId: () => 'shipping',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
});

const sizingGuideCollection = defineCollection({
  loader: glob({
    pattern: 'index.md',
    base: './src/data/sizing-guide',
    generateId: () => 'sizing-guide',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
  }),
});

const customers = defineCollection({
  loader: glob({
    pattern: '*/index.json',
    base: './src/data/customers',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      reviews: z.string().optional(),
      rate: z.number().optional(),
      image: image().optional(),
    }),
});

export const collections = {
  products,
  policies: privacyPolicyCollection,
  shipping: shippingPolicyCollection,
  sizingGuide: sizingGuideCollection,
  customers,
};
