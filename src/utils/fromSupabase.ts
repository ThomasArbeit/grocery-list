import camelcaseKeys from 'camelcase-keys';

/**
 * Transforme les clés d’un objet Supabase en camelCase
 * @param data Donnée brute de Supabase
 * @returns Donnée avec clés en camelCase
 */
export function fromSupabase<T = any>(data: unknown): T {
  if (typeof data === 'object' && data !== null) {
    return camelcaseKeys(data as Record<string, unknown> | readonly Record<string, unknown>[], { deep: true }) as T;
  }
  throw new TypeError('Input data must be an object or array of objects');
}
