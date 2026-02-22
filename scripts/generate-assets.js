import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// Brand colors
const brandOrange = '#f97316';
const brandDark = '#1a1a2e';
const textWhite = '#ffffff';

// Generate Favicon SVG (flame icon representing faith/fuel)
const faviconSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#ea580c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="${brandDark}"/>
  <g transform="translate(128, 64) scale(1.0)">
    <path d="M128 0C128 0 96 64 96 128C96 160 112 192 128 208C144 192 160 160 160 128C160 64 128 0 128 0Z
             M128 48C136 80 144 112 144 128C144 144 140 160 128 176C116 160 112 144 112 128C112 112 120 80 128 48Z" 
          fill="url(#flameGrad)" transform="translate(0, 32) scale(2)"/>
    <text x="128" y="360" font-family="Arial Black, Arial, sans-serif" font-size="100" font-weight="900" 
          fill="${textWhite}" text-anchor="middle">FF</text>
  </g>
</svg>
`;

// Generate OG Image SVG (1200x630 standard size)
const ogImageSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="flameGradOg" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#ea580c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fb923c;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  
  <!-- Decorative pattern -->
  <g opacity="0.05">
    <circle cx="100" cy="100" r="200" fill="${brandOrange}"/>
    <circle cx="1100" cy="530" r="250" fill="${brandOrange}"/>
  </g>
  
  <!-- Flame Icon -->
  <g transform="translate(440, 120)">
    <path d="M60 0C60 0 40 32 40 64C40 80 48 96 60 104C72 96 80 80 80 64C80 32 60 0 60 0Z" 
          fill="url(#flameGradOg)" filter="url(#glow)" transform="scale(1.5)"/>
  </g>
  
  <!-- Main Text: FaithFuel -->
  <text x="600" y="380" font-family="Arial Black, Helvetica, sans-serif" font-size="120" font-weight="900" 
        fill="${textWhite}" text-anchor="middle" letter-spacing="4">
    <tspan fill="${brandOrange}">Faith</tspan><tspan fill="${textWhite}">Fuel</tspan>
  </text>
  
  <!-- Tagline -->
  <text x="600" y="460" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="400" 
        fill="#94a3b8" text-anchor="middle" letter-spacing="8">
    WEAR YOUR FAITH
  </text>
  
  <!-- Bottom accent line -->
  <rect x="450" y="520" width="300" height="4" rx="2" fill="${brandOrange}" opacity="0.8"/>
</svg>
`;

async function generateAssets() {
  console.log('🎨 Generating FaithFuel assets...\n');

  // Generate favicon.ico (multi-size ICO)
  console.log('📌 Creating favicon.ico...');
  const faviconBuffer = Buffer.from(faviconSvg);

  // Create multiple sizes for the favicon
  const favicon16 = await sharp(faviconBuffer).resize(16, 16).png().toBuffer();
  const favicon32 = await sharp(faviconBuffer).resize(32, 32).png().toBuffer();
  const favicon48 = await sharp(faviconBuffer).resize(48, 48).png().toBuffer();

  // For simplicity, save as PNG (browsers support it), and also save the 32x32 as ico
  await sharp(faviconBuffer)
    .resize(32, 32)
    .toFile(join(publicDir, 'favicon.ico'));

  // Also save favicon.svg for modern browsers
  await sharp(faviconBuffer)
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'favicon.png'));

  console.log('✅ favicon.ico created');

  // Generate OG image
  console.log('🖼️  Creating og-image.jpg...');
  const ogBuffer = Buffer.from(ogImageSvg);

  await sharp(ogBuffer)
    .jpeg({ quality: 90 })
    .toFile(join(publicDir, 'og-image.jpg'));

  console.log('✅ og-image.jpg created');

  // Also create a PNG version
  await sharp(ogBuffer).png().toFile(join(publicDir, 'og-image.png'));

  console.log('✅ og-image.png created');

  console.log('\n🎉 All assets generated successfully in /public/');
}

generateAssets().catch(console.error);
