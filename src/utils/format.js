/**
 * Format angka ke Rupiah: 1000000 → "Rp 1.000.000"
 */
export function formatRupiah(num) {
  if (typeof num !== 'number') return num
  return 'Rp ' + num.toLocaleString('id-ID')
}
