export const SITE = {
  title: 'FaithFuel',
  description: 'FaithFuel is a platform for spiritual growth and inspiration.',
  author: 'FaithFuel Team',
};

export const OG = {
  title: 'FaithFuel',
  description: 'FaithFuel is a platform for spiritual growth and inspiration.',
  image: '/og-image.png',
};

export const SEO = {
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.title,
    url: 'https://faithfuel.melnerdz.com',
    author: {
      '@type': 'Organization',
      name: SITE.author,
    },
    description: SITE.description,
  },
};
