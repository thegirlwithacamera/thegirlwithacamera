import { getSupabaseAdmin } from '@/lib/supabase/client';

export interface EditionAvailability {
  editionSize: number;
  soldCount: number;
  remaining: number;
}

/**
 * Reads current stock for the given product ids from print_editions.
 * Fails open (returns {}) if the table doesn't exist yet or Supabase is
 * unreachable — better to sell without a cap briefly than to break checkout.
 */
export async function getEditionAvailability(
  productIds: string[]
): Promise<Record<string, EditionAvailability>> {
  if (productIds.length === 0) return {};

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('print_editions')
      .select('product_id, edition_size, sold_count')
      .in('product_id', productIds);

    if (error) throw error;

    const result: Record<string, EditionAvailability> = {};
    for (const row of data || []) {
      result[row.product_id] = {
        editionSize: row.edition_size,
        soldCount: row.sold_count,
        remaining: Math.max(0, row.edition_size - row.sold_count),
      };
    }
    return result;
  } catch (error) {
    console.error('Error reading edition availability:', error);
    return {};
  }
}

/**
 * Atomically claims up to `quantity` sequential edition numbers for a
 * product via the claim_edition_numbers Postgres function (row-locked,
 * race-safe under concurrent checkouts).
 *
 * Returns null if the product isn't tracked as a limited edition, an
 * empty/short array if it sold out (fewer numbers than requested — the
 * checkout-time stock check should already prevent this in practice).
 */
export async function claimEditionNumbers(
  productId: string,
  quantity: number
): Promise<number[] | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('claim_edition_numbers', {
    p_product_id: productId,
    p_quantity: quantity,
  });
  if (error) throw new Error(`Failed to claim edition numbers: ${error.message}`);
  return data;
}
