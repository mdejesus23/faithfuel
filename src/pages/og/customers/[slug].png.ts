import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';

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

export const getStaticPaths: GetStaticPaths = async () => {
  const files = import.meta.glob('../../../data/customers/*.json', {
    eager: true,
  });
  return Object.entries(files).map(([filePath, mod]) => {
    const slug = filePath.split('/').pop()!.replace('.json', '');
    const data = mod as { name: string };
    return { params: { slug }, props: { name: data.name } };
  });
};

export const GET: APIRoute = async ({ props }) => {
  const { name } = props as { name: string };
  const { regular, bold } = await loadFonts();

  const nameFontSize = name.length > 22 ? 56 : name.length > 14 ? 72 : 88;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter',
          padding: '80px',
          position: 'relative',
        },
        children: [
          // Top accent bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '8px',
                background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
              },
            },
          },

          // Brand label
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: '16px',
                fontWeight: 700,
                color: '#6366f1',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                marginBottom: '32px',
              },
              children: 'FaithFuel',
            },
          },

          // "Thank You" heading
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: '52px',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '-1px',
                marginBottom: '12px',
              },
              children: 'Thank You,',
            },
          },

          // Customer name
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: `${nameFontSize}px`,
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.1,
                textAlign: 'center',
                marginBottom: '40px',
              },
              children: name,
            },
          },

          // Divider
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '64px',
                height: '4px',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
                marginBottom: '32px',
              },
            },
          },

          // Tagline
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: '22px',
                fontWeight: 400,
                color: '#64748b',
                textAlign: 'center',
                maxWidth: '680px',
              },
              children:
                'Your support helps fuel faith and send a pilgrim to World Youth Day 2027.',
            },
          },

          // Bottom domain
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '36px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#cbd5e1',
                letterSpacing: '2px',
              },
              children: 'faithfuel.melnerdz.com',
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
