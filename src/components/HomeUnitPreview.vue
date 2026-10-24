<script setup>
import { computed } from 'vue'
import { imgUrl, primaryPhoto, tierFor } from '@/utils/property'
import { formatRupiah } from '@/utils/format'

const props = defineProps({ unit: { type: Object, required: true }, period: { type: String, default: '' }, featured: Boolean })
const tier = computed(() => tierFor(props.unit, props.period))
const photo = computed(() => primaryPhoto(props.unit))
const otherTiers = computed(() => (props.unit.harga || []).filter(item => item.satuan !== props.period))
const facts = computed(() => (props.unit.fitur || []).filter(item => !/wi-?fi/i.test(item)))
</script>

<template>
  <article class="unit-card" :class="{ 'featured-unit': featured }">
    <RouterLink class="unit-photo" :to="`/detail/${unit.id}`" :aria-label="`View ${unit.judul}`">
      <img v-if="photo" :src="imgUrl(photo)" :alt="unit.judul" loading="lazy" width="800" height="600" />
      <span v-else class="photo-placeholder">Photos coming soon</span>
    </RouterLink>
    <div class="unit-copy">
      <h2 class="unit-title"><RouterLink :to="`/detail/${unit.id}`">{{ unit.judul }}</RouterLink></h2>
      <ul class="unit-facts"><li v-for="fact in facts" :key="fact">{{ fact }}</li><li v-if="unit.luas">{{ unit.luas }} m²</li></ul>
      <p class="unit-status">{{ unit.tag }}</p>
      <p class="unit-price" aria-live="polite" aria-atomic="true"><template v-if="tier">{{ formatRupiah(tier.amount) }} <span>/ {{ tier.satuan }}</span></template><template v-else>Contact us for pricing</template></p>
      <p v-if="featured" class="unit-description">A generous living room, your own kitchen, and room for everyone.</p>
      <p v-else-if="otherTiers.length" class="other-prices">Also available: <span v-for="(item, index) in otherTiers" :key="item.satuan">{{ index ? '; ' : '' }}{{ formatRupiah(item.amount) }} / {{ item.satuan }}</span></p>
      <RouterLink :class="featured ? 'button' : 'text-link'" :to="`/detail/${unit.id}`">View unit <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
    </div>
  </article>
</template>

<style scoped>
.unit-photo { display: block; overflow: hidden; border-radius: 4px; }
.photo-placeholder { display: grid; place-items: center; width: 100%; aspect-ratio: 1.1; background: #eeeeea; color: var(--muted); font-size: 15px; }
.unit-photo img { display: block; width: 100%; height: auto; aspect-ratio: 1.1; object-fit: cover; transition: transform 450ms var(--ease); }
.unit-photo:hover img, .unit-photo:focus-visible img { transform: scale(1.025); }
.unit-title { margin: 20px 0 15px; font-family: var(--display-font); font-size: clamp(26px, 2.35vw, 34px); font-weight: 400; line-height: 1.12; letter-spacing: -.035em; }
.unit-title a { color: inherit; text-decoration: none; }
.unit-title a:hover { text-decoration: underline; text-underline-offset: 5px; }
.unit-facts { display: flex; gap: 8px 15px; flex-wrap: wrap; list-style: none; padding: 0; margin: 0 0 19px; font-size: 14px; color: var(--muted); }
.unit-facts li + li { border-left: 1px solid var(--line); padding-left: 15px; }
.unit-status { font-size: 15px; color: var(--muted); margin: 0 0 5px; }
.unit-price { font-family: var(--display-font); font-size: clamp(28px, 2.8vw, 40px); line-height: 1.2; margin: 0 0 20px; letter-spacing: -.04em; }
.unit-price span { font-size: .62em; letter-spacing: -.015em; }
.other-prices, .unit-description { color: var(--muted); font-size: 15px; line-height: 1.7; margin-bottom: 24px; }
.featured-unit { display: grid; grid-template-columns: 1.55fr 1fr; gap: 48px; align-items: center; }
.featured-unit .unit-photo img { aspect-ratio: 1.44; }
.featured-unit .photo-placeholder { aspect-ratio: 1.44; }
.featured-unit .unit-title { margin-top: 0; font-size: clamp(32px, 3.4vw, 48px); }
.featured-unit .unit-description { font-size: 17px; }
@media (max-width: 700px) { .featured-unit { grid-template-columns: 1fr; gap: 25px; } .unit-title { font-size: 30px; } .featured-unit .unit-title { font-size: 34px; } .unit-price { font-size: 34px; } .unit-photo img { aspect-ratio: 1.2; } }
@media (prefers-reduced-motion: reduce) { .unit-photo img { transition: none; } .unit-photo:hover img, .unit-photo:focus-visible img { transform: none; } }
</style>
