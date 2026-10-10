// API key generation and management utilities.

import { supabase, type ApiKey } from './supabase';

function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'mt_';
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export async function createApiKey(keyName: string, rateLimit: number = 1000): Promise<ApiKey> {
  const apiKey = generateApiKey();
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      key_name: keyName,
      api_key: apiKey,
      rate_limit: rateLimit,
      requests_this_hour: 0,
      total_requests: 0,
      status: 'active',
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error('Failed to create API key');
  }

  return data;
}

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function revokeApiKey(id: string): Promise<void> {
  await supabase.from('api_keys').update({ status: 'revoked' }).eq('id', id);
}

export async function deleteApiKey(id: string): Promise<void> {
  await supabase.from('api_keys').delete().eq('id', id);
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return key;
  return key.slice(0, 6) + '••••••••••••••••' + key.slice(-4);
}
