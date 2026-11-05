import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

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

async function getPostImageDataUrl(slug: string): Promise<string | null> {
  const imagePath = path.join(
    process.cwd(),
    'src/data/posts',
    slug,
    'images/thumb.jpg',
  );
  try {
    const buffer = await sharp(fs.readFileSync(imagePath))
      .resize(600, 630, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toBuffer();
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      author: post.data.author,
      tags: post.data.tags ?? [],
    },
  }));
};

export const GET: APIRoute = async ({ props, params }) => {
  const slug = params.slug!;
  const { title, author, tags } = props as {
    title: string;
    author: string;
    tags: string[];
  };

  const [{ regular, bold }, imageDataUrl] = await Promise.all([
    loadFonts(),
    getPostImageDataUrl(slug),
  ]);

  const hasImage = imageDataUrl !== null;
  const fontSize = title.length > 60 ? 36 : title.length > 35 ? 44 : 54;
  const rightPadding = hasImage ? '52px 60px 52px 52px' : '52px 80px';
  const firstTag = tags[0] ?? null;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          height: '100%',
          backgroundColor: '#f8fafc',
          fontFamily: 'Inter',
        },
        children: [
          // Left: post image
          ...(hasImage
            ? [
                {
                  type: 'img',
                  props: {
                    src: imageDataUrl,
                    style: {
                      width: '540px',
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
                backgroundColor: '#ffffff',
                borderLeft: hasImage ? '1px solid #e2e8f0' : 'none',
              },
              children: [
                // Accent bar
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
                      marginBottom: '28px',
                    },
                  },
                },

                // Brand
                {
                  type: 'span',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#6366f1',
                      letterSpacing: '4px',
                      textTransform: 'uppercase',
                    },
                    children: 'FaithFuel',
                  },
                },

                // Title
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
                          lineHeight: 1.2,
                        },
                        children: title,
                      },
                    },
                  },
                },

                // Footer
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    },
                    children: [
                      ...(firstTag
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  color: '#6366f1',
                                  backgroundColor: '#ede9fe',
                                  padding: '4px 14px',
                                  borderRadius: '999px',
                                  textTransform: 'capitalize',
                                  width: 'max-content',
                                },
                                children: firstTag,
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '15px',
                            fontWeight: 600,
                            color: '#475569',
                          },
                          children: `By ${author}`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '12px',
                            color: '#94a3b8',
                            marginTop: '2px',
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
