<script setup>
import settings from '@/data/settings.json'
import { imgUrl, whatsappUrl } from '@/utils/property'
import RevealBlock from '@/components/shared/RevealBlock.vue'
</script>

<template>
  <div class="about-page page-width">
    <p class="eyebrow">About the residence</p>
    <h1 class="display-title">A home base in<br />the heart of Jogja.</h1>
    <RevealBlock class="about-layout">
      <img :src="imgUrl(settings.about.image)" alt="The courtyard at Paviliun 900" width="900" height="675" />
      <div class="about-copy">
        <h2 class="section-title">Comfort,<br />without the rush.</h2>
        <p class="body-copy">{{ settings.about.text }}</p>
        <p class="body-copy">{{ settings.hero.title }}. {{ settings.hero.subtitle }}.</p>
        <a class="button" :href="whatsappUrl('Hello, I would like to find out more about staying at Paviliun 900.')" target="_blank" rel="noopener noreferrer">Check availability <i class="mdi mdi-arrow-right" aria-hidden="true" /></a>
        <RouterLink class="text-link explore-link" to="/#units">Explore our spaces <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
      </div>
    </RevealBlock>
  </div>
</template>

<style scoped>
.about-page { padding-top: 180px; padding-bottom: 100px; }
.about-page .display-title { max-width: 1000px; margin-bottom: 70px; }
.about-layout { display: grid; grid-template-columns: 1.2fr 1fr; gap: 70px; align-items: center; }
.about-layout img { width: 100%; height: auto; aspect-ratio: 1.2; object-fit: cover; border-radius: 4px; }
.about-copy .body-copy { margin-block: 25px; }
.explore-link { display: flex; width: max-content; margin-top: 25px; }
@media (max-width: 700px) { .about-page { padding-top: 130px; padding-bottom: 60px; } .about-page .display-title { margin-bottom: 40px; } .about-layout { grid-template-columns: 1fr; gap: 32px; } }
</style>
