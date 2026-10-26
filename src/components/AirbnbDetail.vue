<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import units from '@/data/units.json'
import { categoryForPhoto, imgUrl, nightlyTier as findNightlyTier, primaryPhoto } from '@/utils/property'
import { formatRupiah } from '@/utils/format'
import UnitInformation from '@/components/unit/UnitInformation.vue'
import { findUnitByRoute, unitSlug } from '@/utils/unit-slug'
const route = useRoute()
const router = useRouter()
const detailUnit = computed(() => findUnitByRoute(units, route.params.slug))
const nightlyTier = computed(() => findNightlyTier(detailUnit.value))
const nightly = computed(() => Boolean(nightlyTier.value))
const photos = computed(() => (detailUnit.value?.gambar || []).filter(Boolean))
const heroPhoto = computed(() => photos.value.find(name => categoryForPhoto(name) === 'Living & dining') || primaryPhoto(detailUnit.value))
const previewPhotos = computed(() => {
  const rooms = ['Bedrooms', 'Kitchen'].map(category => photos.value.find(name => categoryForPhoto(name) === category)).filter(Boolean)
  return [...new Set([...rooms, ...photos.value.filter(name => name !== heroPhoto.value)])].slice(0, 2)
})
const contacts = computed(() => detailUnit.value?.order || [])
const facts = computed(() => detailUnit.value?.fitur || [])
function openGallery() { router.push({ name: 'image', params: { slug: unitSlug(detailUnit.value, units) } }) }
</script>

<template>
  <article v-if="detailUnit" :key="detailUnit.id" class="unit-detail">
    <section class="hero detail-hero" :class="{ 'long-term-hero': !nightly }" aria-label="Your space">
      <img v-if="heroPhoto" class="hero-image" :src="imgUrl(heroPhoto)" :alt="detailUnit.judul" fetchpriority="high" />
      <div class="page-width detail-hero-inner">
        <RouterLink class="back-link" :to="{ name: 'home', hash: '#units' }"><span class="mdi mdi-arrow-left" aria-hidden="true" /> Back to our spaces</RouterLink>
        <div class="detail-hero-content hero-content">
          <div class="detail-heading">
            <h1 class="display-title">{{ nightly ? 'Stay together.' : 'Make room for living.' }}</h1>
            <p class="detail-title">{{ detailUnit.judul }}</p>
          </div>
          <div class="detail-summary">
            <p class="detail-facts">{{ facts.join(' / ') }}<template v-if="detailUnit.luas"> / {{ detailUnit.luas }} m²</template></p>
            <p class="availability">{{ detailUnit.tag }}</p>
            <p v-if="nightlyTier" class="hero-price">{{ formatRupiah(nightlyTier.amount) }} <span>/ {{ nightlyTier.satuan }}</span></p>
            <p v-else-if="detailUnit.tag === 'Not Available'" class="availability-note">Ask about upcoming availability.</p>
            <a v-for="(order, index) in contacts" :key="index" class="button detail-enquiry" :href="order.link" target="_blank" rel="noopener noreferrer">Check availability<span v-if="contacts.length > 1"> · {{ order.detail }}</span></a>
            <button class="text-link hero-photo-link" @click="openGallery">Show all Photos <span class="mdi mdi-arrow-right" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </section>
    <div class="page-width">
      <div v-if="previewPhotos.length" class="detail-previews" :class="{ 'one-photo': previewPhotos.length === 1 }">
        <button v-for="photo in previewPhotos" :key="photo" class="preview-photo" :aria-label="`View ${categoryForPhoto(photo).toLowerCase()} photos`" @click="openGallery">
          <img :src="imgUrl(photo)" :alt="`${detailUnit.judul} — ${categoryForPhoto(photo)}`" loading="lazy" />
        </button>
      </div>
      <p v-else class="empty-photos">Room photographs will be added here.</p>
      <div v-if="photos.length" class="gallery-actions">
        <RouterLink class="button button-outline" :to="{ name: 'image', params: { slug: unitSlug(detailUnit, units) } }">
          <span class="mdi mdi-image-multiple-outline" aria-hidden="true" />
          View all photos ({{ photos.length }})
        </RouterLink>
      </div>
      <UnitInformation :unit="detailUnit" />
    </div>
  </article>
</template>

<style scoped>
.detail-hero { min-height: 720px; height: min(860px, 88svh); background: #292927; }
.detail-hero-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; padding-top: 138px; padding-bottom: 50px; color: white; }
.detail-hero-content { margin-top: auto; display: grid; grid-template-columns: minmax(0, 1fr) minmax(265px, .42fr); gap: 38px; align-items: end; }
.detail-heading .display-title { font-size: clamp(70px, 7.5vw, 116px); line-height: 1.03; letter-spacing: -.045em; max-width: 900px; margin: 0 0 20px; }
.long-term-hero .detail-heading .display-title { font-size: clamp(64px, 6.1vw, 94px); }
.detail-title { font-size: clamp(20px, 2.1vw, 30px); line-height: 1.35; margin: 0; }
.detail-facts { font-size: 14px; line-height: 1.7; margin: 0 0 22px; }
.availability { font-family: var(--display-font);font-weight:400; font-size: 29px; margin: 0 0 5px; }
.availability-note { font-size: 14px; margin: 0 0 24px; }
.hero-price { font-family: var(--display-font);font-weight:400; font-size: 34px; margin: 0 0 20px; white-space: nowrap; }
.hero-price span { font-size: 18px; }
.detail-enquiry { width: 100%; margin: 6px 0; }
.hero-photo-link { display: flex; align-items: center; gap: 12px; margin-top: 16px; color: white; }
.detail-previews { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 28px; }
.detail-previews.one-photo { grid-template-columns: 1fr; }
.gallery-actions { display: flex; justify-content: flex-end; margin-top: 20px; }
.preview-photo { display: block; overflow: hidden; border: 0; border-radius: 4px; background: #e6e6e2; cursor: pointer; padding: 0; }
.preview-photo img { width: 100%; height: 310px; display: block; object-fit: cover; transition: transform .45s var(--ease); }
.preview-photo:hover img { transform: scale(1.025); }
.empty-photos { padding-block: 32px; color: var(--muted); }
@media (max-width: 760px) {
  .detail-hero { height: auto; min-height: 850px; }
  .detail-hero-inner { min-height: 850px; padding-top: 120px; padding-bottom: 36px; }
  .detail-hero-content { grid-template-columns: 1fr; gap: 32px; padding-top: 100px; }
  .detail-heading .display-title, .long-term-hero .detail-heading .display-title { font-size: clamp(58px, 12vw, 86px); }
  .detail-summary { max-width: 420px; }
  .detail-facts { margin-bottom: 14px; }
  .detail-previews { gap: 12px; margin-top: 20px; }
  .gallery-actions .button { width: 100%; }
  .preview-photo img { height: 220px; }
}
@media (prefers-reduced-motion: reduce) { .preview-photo img { transition: none; } .preview-photo:hover img { transform: none; } }
</style>
