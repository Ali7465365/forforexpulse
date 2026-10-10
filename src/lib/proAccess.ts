// PRO access management: tracks ad views, unlocks 1-day PRO pass, checks expiry.

import { supabase, type ProPass } from './supabase';

export type { ProPass };

const STORAGE_KEY = 'mt_active_pro_pass_id';

const adContent = [
  { title: 'Global Freight Solutions', advertiser: 'Maersk Logistics', duration: 15 },
  { title: 'Trade Finance Made Easy', advertiser: 'HSBC Commercial', duration: 12 },
  { title: 'Cloud Supply Chain Platform', advertiser: 'Oracle NetSuite', duration: 18 },
  { title: 'Secure International Payments', advertiser: 'Wise Business', duration: 10 },
  { title: 'Smart Inventory Management', advertiser: 'Shopify Plus', duration: 14 },
];

export function getAdContent(index: number) {
  return adContent[index] ?? adContent[0];
}

export function getStoredProPassId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredProPassId(id: string) {
  localStorage.setItem(STORAGE_KEY, id);
}

export function clearStoredProPassId() {
  localStorage.removeItem(STORAGE_KEY);
}

export async function getOrCreateProPass(): Promise<ProPass> {
  const storedId = getStoredProPassId();

  if (storedId) {
    const { data } = await supabase
      .from('pro_passes')
      .select('*')
      .eq('id', storedId)
      .maybeSingle();

    if (data) {
      if (data.unlocked && data.expires_at && new Date(data.expires_at) < new Date()) {
        return data;
      }
      return data;
    }
  }

  const { data: newPass, error } = await supabase
    .from('pro_passes')
    .insert({ ads_watched: 0, unlocked: false })
    .select()
    .single();

  if (error || !newPass) {
    throw new Error('Failed to create PRO pass');
  }

  setStoredProPassId(newPass.id);
  return newPass;
}

export async function recordAdView(passId: string, adNumber: number): Promise<ProPass> {
  const ad = getAdContent(adNumber - 1);

  await supabase.from('ad_views').insert({
    pro_pass_id: passId,
    ad_number: adNumber,
    ad_title: ad.title,
    advertiser: ad.advertiser,
  });

  const newAdsWatched = adNumber;
  const shouldUnlock = newAdsWatched >= 5;

  const updateData: Record<string, unknown> = {
    ads_watched: newAdsWatched,
  };

  if (shouldUnlock) {
    const now = new Date();
    const expiry = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    updateData.unlocked = true;
    updateData.unlocked_at = now.toISOString();
    updateData.expires_at = expiry.toISOString();
  }

  const { data, error } = await supabase
    .from('pro_passes')
    .update(updateData)
    .eq('id', passId)
    .select()
    .single();

  if (error || !data) {
    throw new Error('Failed to update PRO pass');
  }

  return data;
}

export function isProActive(pass: ProPass | null): boolean {
  if (!pass || !pass.unlocked || !pass.expires_at) return false;
  return new Date(pass.expires_at) > new Date();
}

export function getProExpiry(pass: ProPass | null): Date | null {
  if (!pass || !pass.expires_at) return null;
  return new Date(pass.expires_at);
}

export function getProTimeRemaining(pass: ProPass | null): { days: number; hours: number } | null {
  if (!pass || !pass.expires_at || !isProActive(pass)) return null;
  const expiry = new Date(pass.expires_at);
  const now = new Date();
  const ms = expiry.getTime() - now.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours };
}
