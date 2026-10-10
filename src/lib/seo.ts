// SEO utilities: dynamic document title, meta tag management, and sitemap generation helper.

type MetaTag = {
  name?: string;
  property?: string;
  content: string;
};

const DEFAULT_META: MetaTag[] = [
  { name: 'description', content: 'MarketScope - Real-time global trade intelligence platform. Discover high-value trade opportunities, interactive market maps, and exclusive trade signals.' },
  { property: 'og:title', content: 'MarketScope - Global Trade Intelligence Platform' },
  { property: 'og:description', content: 'Real-time market intelligence, interactive trade hub maps, and high-margin trade signals for global traders.' },
  { property: 'og:type', content: 'website' },
  { property: 'og:image', content: 'https://bolt.new/static/og_default.png' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'MarketScope - Global Trade Intelligence' },
  { name: 'twitter:description', content: 'Real-time market intelligence and trade signals for global traders.' },
  { name: 'twitter:image', content: 'https://bolt.new/static/og_default.png' },
  { name: 'keywords', content: 'market intelligence, trade signals, global trade, trade hubs, market analysis, commodity trading, supply chain, trade map' },
  { name: 'robots', content: 'index, follow' },
  { name: 'author', content: 'MarketScope' },
];

function setMetaTag(tag: MetaTag) {
  const attr = tag.property ? 'property' : 'name';
  const value = tag.property ?? tag.name;
  let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (tag.property) el.setAttribute('property', tag.property);
    else if (tag.name) el.setAttribute('name', tag.name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', tag.content);
}

export function updateSEO(opts: { title?: string; description?: string; path?: string } = {}) {
  const title = opts.title ?? 'MarketScope - Global Trade Intelligence Platform';
  document.title = title;

  setMetaTag({ name: 'description', content: opts.description ?? DEFAULT_META[0].content });
  setMetaTag({ property: 'og:title', content: title });
  setMetaTag({ property: 'og:description', content: opts.description ?? DEFAULT_META[1].content });
  setMetaTag({ property: 'og:url', content: `${window.location.origin}${opts.path ?? '/'}` });

  DEFAULT_META.forEach((m) => {
    if (m.name === 'description' || (m.property === 'og:title') || (m.property === 'og:description') || (m.property === 'og:url')) return;
    setMetaTag(m);
  });
}

export function initSEO() {
  DEFAULT_META.forEach(setMetaTag);
}

// Sitemap helper - generates a sitemap XML string for the application's routes
export function generateSitemap(baseUrl: string = 'https://marketscope.app'): string {
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/dashboard', priority: '0.9', changefreq: 'hourly' },
    { path: '/map', priority: '0.9', changefreq: 'realtime' },
    { path: '/api-portal', priority: '0.8', changefreq: 'weekly' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
  ];

  const now = new Date().toISOString().split('T')[0];
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${baseUrl}${r.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
