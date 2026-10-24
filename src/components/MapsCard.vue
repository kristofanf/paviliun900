<script setup>
import { computed } from 'vue'
import settings from '@/data/settings.json'
import RevealBlock from '@/components/shared/RevealBlock.vue'

const nearbyGroups = computed(() => {
  const groups = [{ title: 'Study', places: [] }, { title: 'Everyday', places: [] }, { title: 'Healthcare', places: [] }]
  for (const place of settings.location.nearby) {
    const group = /Universitas/i.test(place) ? 0 : /\bRS\b|hospital/i.test(place) ? 2 : 1
    groups[group].places.push(place)
  }
  return groups
})
const mapLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.location.address)}`)
</script>

<template>
  <section id="location" class="location section-space" aria-label="Location">
    <RevealBlock class="location-top">
      <div class="location-copy">
        <h2 class="section-title">The city,<br />within easy reach.</h2>
        <p class="location-address">{{ settings.location.address }}</p>
        <a class="text-link" :href="mapLink" target="_blank" rel="noopener noreferrer">Open in Google Maps <i class="mdi mdi-arrow-top-right" aria-hidden="true" /></a>
      </div>
      <iframe :src="settings.location.mapEmbed" class="location-map" title="Paviliun 900 Location" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
    </RevealBlock>
    <RevealBlock class="nearby-groups">
      <div v-for="group in nearbyGroups" :key="group.title" class="nearby-group">
        <h3>{{ group.title }}</h3>
        <ul><li v-for="place in group.places" :key="place">{{ place }}</li></ul>
      </div>
    </RevealBlock>
  </section>
</template>

<style scoped>
.location-top { display: grid; grid-template-columns: 1fr 1.1fr; align-items: center; gap: 64px; }
.location-address { margin: 25px 0 22px; color: var(--muted); font-size: 15px; line-height: 1.7; }
.location-map { border: 0; width: 100%; height: 340px; border-radius: 4px; background: #e8e8e5; }
.nearby-groups { display: grid; grid-template-columns: 1fr 1.1fr 1fr; margin-top: 52px; }
.nearby-group { padding-right: 30px; }
.nearby-group + .nearby-group { border-left: 1px solid var(--line); padding-left: 40px; }
.nearby-group h3 { font-family: var(--display-font); font-weight: 400; font-size: 28px; margin: 0 0 18px; }
.nearby-group ul { list-style: none; padding: 0; margin: 0; }
.nearby-group li { font-size: 14px; color: var(--muted); line-height: 1.75; margin: 0 0 12px; }
@media (max-width: 700px) { .location-top { grid-template-columns: 1fr; gap: 30px; } .location-map { height: 300px; } .nearby-groups { grid-template-columns: 1fr; gap: 25px; margin-top: 32px; } .nearby-group { padding: 0; } .nearby-group + .nearby-group { border-left: 0; border-top: 1px solid var(--line); padding: 25px 0 0; } }
</style>
