<script setup>
import { computed, nextTick, shallowRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import units from '@/data/units.json'
import { categoryForPhoto, imgUrl, primaryPhoto } from '@/utils/property'
import PhotoViewer from '@/components/unit/PhotoViewer.vue'
const route = useRoute()
const router = useRouter()
const detailUnit = computed(() => units.find(unit => String(unit.id) === String(route.params.id)))
const photos = computed(() => (detailUnit.value?.gambar || []).filter(Boolean))
const heroPhoto = computed(() => photos.value.find(name => categoryForPhoto(name) === 'Living & dining') || primaryPhoto(detailUnit.value))
const categories = computed(() => [...new Set(photos.value.map(categoryForPhoto))].filter(category => category !== 'Other spaces'))
const category = shallowRef('All photos')
const filteredPhotos = computed(() => category.value === 'All photos' ? photos.value : photos.value.filter(name => categoryForPhoto(name) === category.value))
const openIndex = shallowRef(null)
let trigger = null
function openPhoto(index, event) { trigger = event.currentTarget; openIndex.value = index }
async function closePhoto() {
  openIndex.value = null
  const returnTo = trigger
  trigger = null
  await nextTick()
  if (returnTo?.isConnected) returnTo.focus({ preventScroll: true })
}
watch(() => route.params.id, () => { trigger = null; openIndex.value = null; category.value = 'All photos' })
function back() { router.push({ name: 'detail', params: { id: detailUnit.value.id } }) }
</script>

<template>
  <article v-if="detailUnit" class="unit-gallery">
    <section class="hero gallery-hero">
      <img v-if="heroPhoto" class="hero-image" :src="imgUrl(heroPhoto)" :alt="detailUnit.judul" fetchpriority="high" />
      <div class="page-width gallery-hero-inner">
        <button class="back-link" aria-label="Back" @click="back"><span class="mdi mdi-arrow-left" aria-hidden="true" /> Back to unit</button>
        <div class="gallery-hero-content hero-content">
          <h1 class="display-title">A closer look.</h1>
          <div><h2>{{ detailUnit.judul }}</h2><p>Explore the rooms before your stay.</p></div>
        </div>
      </div>
    </section>
    <section class="page-width gallery-section" aria-label="Unit photographs">
      <div v-if="photos.length" class="photo-filters" role="group" aria-label="Filter photographs">
        <button :aria-pressed="category === 'All photos'" @click="category = 'All photos'">All photos</button>
        <button v-for="item in categories" :key="item" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
      </div>
      <p v-if="!photos.length" class="empty-gallery">Photographs for this unit will be added here.</p>
      <div v-else class="photo-grid">
        <button v-for="(photo, index) in filteredPhotos" :key="`${photo}-${index}`" class="gallery" :aria-label="`View photo ${index + 1}: ${categoryForPhoto(photo)}`" @click="openPhoto(index, $event)">
          <span class="gallery-image"><img :src="imgUrl(photo)" :alt="`${detailUnit.judul} — ${categoryForPhoto(photo)}`" loading="lazy" /></span>
          <span class="photo-caption">{{ categoryForPhoto(photo) === 'Other spaces' ? `Photo ${photos.indexOf(photo) + 1}` : categoryForPhoto(photo) }}<span class="mdi mdi-arrow-top-right" aria-hidden="true" /></span>
        </button>
      </div>
      <p v-if="photos.length" class="photo-instruction">Select a photo to view it larger. <span>{{ filteredPhotos.length }} photos</span></p>
    </section>
    <Teleport to="body">
      <PhotoViewer v-if="openIndex !== null" :photos="filteredPhotos" :initial-index="openIndex" :unit-name="detailUnit.judul" @close="closePhoto" />
    </Teleport>
  </article>
</template>

<style scoped>
.gallery-hero { min-height: 620px; height: 78svh; max-height: 830px; background: #292927; }
.gallery-hero-inner { position: relative; z-index: 1; height: 100%; display: flex; flex-direction: column; padding-top: 138px; padding-bottom: 44px; color: white; }
.gallery-hero-content { margin-top: auto; display: grid; grid-template-columns: 1.35fr 1fr; gap: 50px; align-items: end; }
.gallery-hero-content h1 { font-size: clamp(70px, 7.2vw, 112px); line-height: 1.05; margin: 0; letter-spacing: -.04em; }
.gallery-hero-content h2 { font-family: var(--display-font); font-weight: 400; font-size: clamp(24px, 2.5vw, 37px); line-height: 1.3; margin: 0 0 12px; }
.gallery-hero-content p { margin: 0 0 9px; font-size: 18px; }
.gallery-section { padding-block: 30px 80px; }
.photo-filters { display: flex; flex-wrap: wrap; gap: 8px 34px; margin-bottom: 24px; }
.photo-filters button { color: var(--muted); padding: 10px 0; background: transparent; border: 0; border-bottom: 2px solid transparent; cursor: pointer; }
.photo-filters button[aria-pressed='true'] { color: var(--ink); border-bottom-color: var(--ink); }
.photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 26px; }
.gallery { display: block; min-width: 0; text-align: left; padding: 0; border: 0; background: transparent; color: var(--ink); cursor: pointer; }
.gallery-image { display: block; overflow: hidden; border-radius: 4px; background: #e6e6e2; }
.gallery img { display: block; width: 100%; aspect-ratio: 1.6; object-fit: cover; transition: transform .45s var(--ease); }
.gallery:nth-child(5n + 3) { grid-column: 1 / -1; }
.gallery:nth-child(5n + 3) img { aspect-ratio: 2.3; }
.gallery:hover img { transform: scale(1.025); }
.photo-caption { display: flex; justify-content: space-between; gap: 14px; margin-top: 12px; font-size: 14px; }
.photo-instruction { display: flex; justify-content: space-between; gap: 20px; color: var(--muted); font-size: 14px; margin-top: 32px; }
.empty-gallery { padding-block: 70px; color: var(--muted); }
@media (max-width: 760px) {
  .gallery-hero { min-height: 650px; height: 84svh; }
  .gallery-hero-inner { padding-top: 120px; padding-bottom: 34px; }
  .gallery-hero-content { grid-template-columns: 1fr; gap: 24px; }
  .gallery-hero-content h1 { font-size: clamp(58px, 12vw, 86px); }
  .gallery-hero-content h2 { font-size: 26px; }
  .gallery-hero-content p { font-size: 15px; }
  .photo-filters { gap: 4px 22px; font-size: 13px; }
  .photo-grid { grid-template-columns: 1fr; gap: 26px; }
  .gallery:nth-child(5n + 3) { grid-column: auto; }
  .gallery:nth-child(5n + 3) img, .gallery img { aspect-ratio: 1.35; }
  .photo-instruction { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) { .gallery img { transition: none; } .gallery:hover img { transform: none; } }
</style>
