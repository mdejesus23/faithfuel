import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Fetch and cache both font weights once for the entire build
let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null =
  null;

function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetch(
        'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-400-normal.woff',
      ).then((r) => r.arrayBuffer()),
      fetch(
        'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/files/inter-latin-700-normal.woff',
      ).then((r) => r.arrayBuffer()),
    ]).then(([regular, bold]) => ({ regular, bold }));
  }
  return fontsPromise;
}

async function getProductImageDataUrl(slug: string): Promise<string | null> {
  const imagePath = path.join(
    process.cwd(),
    'src/data/products',
    slug,
    'images/main.jpg',
  );
  try {
    const buffer = await sharp(fs.readFileSync(imagePath))
      .resize(500, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toBuffer();
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getCollection('products');
  return products.map((product) => ({
    params: { slug: product.id },
    props: {
      name: product.data.name,
      price: product.data.price,
      category: product.data.category,
    },
  }));
};

export const GET: APIRoute = async ({ props, params }) => {
  const slug = params.slug!;
  const { name, price, category } = props as {
    name: string;
    price: number;
    category: string;
  };

  const [{ regular, bold }, imageDataUrl] = await Promise.all([
    loadFonts(),
    getProductImageDataUrl(slug),
  ]);

  const fontSize = name.length > 35 ? 48 : name.length > 20 ? 60 : 72;

  // Right-panel width depends on whether we have a product image
  const hasImage = imageDataUrl !== null;
  const rightPadding = hasImage ? '56px 64px 56px 56px' : '56px 80px';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter',
        },
        children: [
          // Left: product image
          ...(hasImage
            ? [
                {
                  type: 'img',
                  props: {
                    src: imageDataUrl,
                    style: {
                      width: '460px',
                      height: '630px',
                      objectFit: 'cover',
                      flexShrink: 0,
                    },
                  },
                },
              ]
            : []),

          // Right: text content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
                padding: rightPadding,
                borderLeft: hasImage ? '1px solid #f1f5f9' : 'none',
              },
              children: [
                // Accent bar at top of right panel
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      height: '4px',
                      width: '48px',
                      borderRadius: '999px',
                      background:
                        'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
                      marginBottom: '32px',
                    },
                  },
                },

                // Brand name
                {
                  type: 'span',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#6366f1',
                      letterSpacing: '4px',
                      textTransform: 'uppercase',
                    },
                    children: 'FaithFuel',
                  },
                },

                // Product name — grows to fill remaining space
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: '1',
                      alignItems: 'center',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: `${fontSize}px`,
                          fontWeight: 700,
                          color: '#0f172a',
                          lineHeight: 1.15,
                        },
                        children: name,
                      },
                    },
                  },
                },

                // Footer: category + price
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#6366f1',
                            backgroundColor: '#ede9fe',
                            padding: '4px 14px',
                            borderRadius: '999px',
                            textTransform: 'capitalize',
                          },
                          children: category,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '40px',
                            fontWeight: 700,
                            color: '#2563eb',
                          },
                          children: `\u20B1${price.toFixed(2)}`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            color: '#94a3b8',
                            marginTop: '4px',
                          },
                          children: 'faithfuel.melnerdz.com',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
