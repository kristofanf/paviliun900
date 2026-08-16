/**
 * Format angka ke Rupiah: 1000000 → "Rp 1.000.000"
 */
export function formatRupiah(num) {
  if (typeof num !== 'number') return num
  return 'Rp ' + num.toLocaleString('id-ID')
}

/**
 * Format harga tunggal: {amount, satuan} → "Rp 1.000.000/malam"
 */
export function formatHarga(amount, satuan) {
  return formatRupiah(amount) + (satuan ? `/${satuan}` : '')
}

/**
 * Harga terendah dari array tiers: [{amount,satuan}] → "Rp 1.000.000"
 * Digunakan di card list
 */
export function hargaMulaiDari(tiers) {
  if (!Array.isArray(tiers) || !tiers.length) return '-'
  const min = Math.min(...tiers.map(t => t.amount))
  return formatRupiah(min)
}
