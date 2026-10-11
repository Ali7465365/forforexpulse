export type BusinessMode = 'new' | 'ongoing';

export type BusinessAdvice = {
  mode: BusinessMode;
  area: string;
  city: string;
  country: string;
  businessInput: string;
  headline: string;
  summary: string;
  recommendations: string[];
  opportunities: string[];
  risks: string[];
  nextSteps: string[];
  confidence: string;
};

function detectSector(text: string): string {
  const t = text.toLowerCase();
  if (/electronic|phone|mobile|gadget|earbud|laptop|computer/.test(t)) return 'Electronics & gadgets';
  if (/cloth|garment|fashion|textile|fabric|boutique/.test(t)) return 'Fashion & textiles';
  if (/food|restaurant|cafe|bakery|grocery|snack/.test(t)) return 'Food & F&B';
  if (/leather|bag|shoe|wallet/.test(t)) return 'Leather goods';
  if (/cosmetic|beauty|salon|skincare/.test(t)) return 'Beauty & personal care';
  if (/auto|spare|car|bike|mechanic/.test(t)) return 'Auto & spare parts';
  if (/construction|hardware|cement|paint/.test(t)) return 'Hardware & construction';
  if (/pharmacy|medical|clinic|health/.test(t)) return 'Health & pharmacy';
  if (/education|tuition|school|coaching/.test(t)) return 'Education & training';
  if (/logistics|courier|delivery|transport/.test(t)) return 'Logistics & delivery';
  if (/import|export|trading|wholesale/.test(t)) return 'Trading & wholesale';
  return 'General retail / services';
}

export function adviseBusiness(input: {
  mode: BusinessMode;
  area: string;
  city: string;
  country: string;
  businessInput: string;
}): BusinessAdvice {
  const { mode, area, city, country, businessInput } = input;
  const place = [area, city, country].filter(Boolean).join(', ');
  const sector = detectSector(businessInput || 'general');
  const loc = `${city} ${country}`.toLowerCase();

  const isPk = /pakistan|karachi|lahore|islamabad|sialkot|faisalabad/.test(loc);
  const isGulf = /uae|dubai|saudi|riyadh|qatar/.test(loc);
  const isChina = /china|shenzhen|shanghai|guangzhou|yiwu/.test(loc);

  if (mode === 'new') {
    const recommendations: string[] = [];
    if (isPk && sector.includes('Electronics')) {
      recommendations.push('Mobile accessories & repair near Hall Road / Saddar-style markets — high walk-in demand.');
      recommendations.push('Budget earbuds / chargers wholesale-to-retail if you can source from Dubai or China.');
    } else if (isPk && sector.includes('Food')) {
      recommendations.push('Cloud kitchen or small café near offices/universities — lower rent than main boulevard.');
      recommendations.push('Packaged snacks / water distribution for kiryana shops in your area.');
    } else if (isGulf) {
      recommendations.push('Niche retail in high-footfall malls or labor-camp supply (F&B, basics) depending on budget.');
      recommendations.push('B2B supplies to small contractors or salons — less competition than pure consumer retail.');
    } else if (isChina) {
      recommendations.push('Trading / sourcing agency for overseas buyers in your product niche.');
      recommendations.push('Small component or packaging supply to nearby factories.');
    } else {
      recommendations.push(`Start lean in ${sector}: test demand with a small inventory or service before large rent.`);
      recommendations.push('Partner with one local wholesaler so you do not overstock.');
    }

    recommendations.push(`Study 3 competitors already operating near ${place || 'your area'} and undercut on service speed or niche.`);
    recommendations.push('Use social media + WhatsApp catalog targeted to nearby neighborhoods first.');

    return {
      mode,
      area,
      city,
      country,
      businessInput,
      headline: `New business ideas for ${place || 'your location'}`,
      summary: `Based on ${place || 'the area'} and interest in “${businessInput || sector}”, focus on ${sector} with low fixed cost and clear local demand.`,
      recommendations,
      opportunities: [
        `${sector} demand is usually steady in dense urban areas like ${city || 'your city'}.`,
        'Online + offline hybrid sales reduce risk vs shop-only models.',
        isPk ? 'Strong youth market for mobile, fashion, and food delivery.' : 'Look for underserved niches competitors ignore.',
      ],
      risks: [
        'High rent on main roads can kill margin — start secondary street if needed.',
        'Copycat competition if the idea is too generic.',
        'Import delays / FX if you depend on foreign stock.',
      ],
      nextSteps: [
        'Validate: talk to 20 potential customers in the area this week.',
        'List startup cost: rent, stock, licenses, marketing.',
        'Pick one product line only for the first 60 days.',
        'Use Product Research in this app for supply prices in nearby hubs.',
      ],
      confidence: 'Advisory estimate ~90% directional — not a formal market study.',
    };
  }

  // ongoing expansion
  return {
    mode,
    area,
    city,
    country,
    businessInput,
    headline: `Expansion ideas for your ${sector} business in ${place || 'your area'}`,
    summary: `For an ongoing “${businessInput || sector}” business in ${place || 'this area'}, growth usually comes from more channels, adjacent products, and B2B accounts — not only a bigger shop.`,
    recommendations: [
      'Add 1–2 adjacent products your current customers already ask for.',
      'Open a WhatsApp / Instagram order line for nearby societies or offices.',
      isPk ? 'Supply 5–10 smaller retailers as a mini-distributor to raise volume.' : 'Target corporate or bulk orders once a week.',
      'Improve margin: renegotiate with supplier or mix higher-margin accessories.',
      sector.includes('Electronics')
        ? 'Offer installation / repair as a paid add-on.'
        : 'Offer delivery within a fixed radius for a small fee.',
    ],
    opportunities: [
      `Cross-sell inside ${sector} to raise average order value.`,
      'Evening / weekend hours if your area has after-work traffic.',
      'Bundle deals (buy 2 get discount) to move slow stock.',
    ],
    risks: [
      'Expanding stock without sales data creates cash stuck in inventory.',
      'Opening a second branch too early doubles rent risk.',
      'Discount wars with neighbors destroy profit.',
    ],
    nextSteps: [
      'Write down your top 20 products by profit (not only by sales).',
      'Pick one expansion bet for 90 days (new channel OR new product line).',
      'Track weekly: revenue, margin, repeat customers.',
      'Use Intelligence + Product Research here to compare supply prices.',
    ],
    confidence: 'Advisory estimate ~90% directional — adjust with your real sales numbers.',
  };
}