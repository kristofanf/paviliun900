import settings from '@/data/settings.json'

export function imgUrl(name) {
  return name ? `${import.meta.env.BASE_URL}img/units/${encodeURIComponent(name)}` : ''
}

export function primaryPhoto(unit) {
  const cleanPhoto = 'WhatsApp_Image_2026-08-16_at_17.04.37__1_.jpeg'
  return unit?.gambar?.includes(cleanPhoto) ? cleanPhoto : unit?.gambar?.[0] || ''
}

export function nightlyTier(unit) {
  return unit?.harga?.find(tier => ['night', 'malam'].includes(tier.satuan))
}

export function isNightly(unit) {
  return Boolean(nightlyTier(unit))
}

export function tierFor(unit, period) {
  return unit.harga?.find(tier => tier.satuan === period) || null
}

export function rentalPeriods(units) {
  const order = ['month', '3 months', '6 months', 'year']
  return [...new Set(units.flatMap(unit => unit.harga?.map(tier => tier.satuan) || []))]
    .sort((a, b) => {
      const left = order.indexOf(a), right = order.indexOf(b)
      return (left < 0 ? order.length : left) - (right < 0 ? order.length : right)
    })
}

// Explicit classifications only for inspected images. New uploads stay in All photos.
const photoCategories = {
  'airbnbTengah.jpg': 'Living & dining',
  'b21-LivingRoom.jpg': 'Living & dining',
  'WhatsApp_Image_2026-08-16_at_17.04.37__1_.jpeg': 'Living & dining',
  'master.jpg': 'Bedrooms',
  'b21-masterBed.jpg': 'Bedrooms',
  'dapur.jpg': 'Kitchen',
  'b21-dapur.jpg': 'Kitchen',
  'km1.jpg': 'Bathrooms',
  'b21-KMM.jpg': 'Bathrooms',
}

export function categoryForPhoto(name) {
  return photoCategories[name] || 'Other spaces'
}

export function whatsappUrl(message) {
  return `https://wa.me/${encodeURIComponent(settings.site.whatsapp)}?text=${encodeURIComponent(message)}`
}
