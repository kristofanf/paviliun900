<script setup>
import AirbnbCard from './AirbnbCard.vue'
import MapsCard from './MapsCard.vue'
import ReviewCard from './ReviewCard.vue'
import RevealBlock from '@/components/shared/RevealBlock.vue'
import settings from '@/data/settings.json'
import { imgUrl } from '@/utils/property'
</script>

<template>
  <div class="page-width home-details">
    <RevealBlock class="home-intro">
      <h2 class="section-title">A home base in the heart of Jogja.</h2>
      <p class="intro-source">{{ settings.hero.title }} <span aria-hidden="true">—</span> {{ settings.hero.subtitle }}</p>
    </RevealBlock>
    <AirbnbCard />
    <RevealBlock tag="section" class="home-about section-space" aria-label="About Paviliun 900">
      <img class="about-photo" :src="imgUrl(settings.about.image)" alt="Quiet courtyard and homes at Paviliun 900" loading="lazy" width="800" height="540" />
      <div>
        <h2 class="section-title">Comfort,<br />without the rush.</h2>
        <p class="body-copy">{{ settings.about.text }}</p>
        <RouterLink class="text-link" to="/about">About the residence <i class="mdi mdi-arrow-right" aria-hidden="true" /></RouterLink>
      </div>
    </RevealBlock>
    <MapsCard />
    <ReviewCard />
  </div>
</template>

<style scoped>
.home-intro { padding-block: 52px 88px; }
.home-intro .section-title { font-size: clamp(36px, 5.5vw, 84px); letter-spacing: -.045em; }
.intro-source { margin: 20px 0 0; font-size: 14px; color: var(--muted); }
.home-about { display: grid; grid-template-columns: 1.35fr .85fr; align-items: center; gap: 60px; }
.about-photo { display: block; width: 100%; height: auto; aspect-ratio: 1.54; object-fit: cover; border-radius: 4px; }
.home-about .body-copy { margin-block: 24px; }
@media (max-width: 700px) { .home-intro { padding-block: 44px 64px; } .home-about { grid-template-columns: 1fr; gap: 30px; } .intro-source { line-height: 1.7; } }
</style>
