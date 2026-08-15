/**
 * Utility untuk load images dari assets secara dinamis.
 * Vite tidak support require(), pakai import.meta.glob.
 */
const imageModules = import.meta.glob('@/assets/airbnb/*.jpg', { eager: true })

const imageMap = {}
for (const path in imageModules) {
  const name = path.split('/').pop().replace('.jpg', '')
  imageMap[name] = imageModules[path].default
}

export function getAirbnbImage(name) {
  return imageMap[name] || ''
}
