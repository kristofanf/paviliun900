<script setup>
import settings from '@/data/settings.json'
import { imgUrl } from '@/utils/property'
</script>

<template>
  <section class="hero home-hero" aria-label="Welcome to Paviliun 900">
    <img class="hero-image" :src="imgUrl(settings.hero.coverImage)" alt="Paviliun 900 residence in Yogyakarta" fetchpriority="high" decoding="async" />
    <div class="hero-content home-arrival">
      <h1 aria-label="Paviliun 900"><span>Paviliun</span> <span>900</span></h1>
      <div class="arrival-copy">
        <p class="hero-subtitle">Room to stay. Space to live.</p>
        <p class="arrival-description">Short stays and furnished apartments in a quieter corner of Yogyakarta.</p>
        <div class="hero-actions">
          <a class="button arrival-button" href="#units">Explore our spaces</a>
          <a class="arrival-link" href="#long-stays">Long-term living</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-hero { min-height: min(850px, 100svh); }
.home-arrival { position: relative; z-index: 1; width: 100%; padding: 0 5.5% 58px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 31%); gap: 48px; align-items: end; }
.home-arrival h1 { margin: 0 0 -12px -8px; font-family: var(--display-font); font-weight: 400; font-size: clamp(96px, 11.6vw, 180px); line-height: .96; letter-spacing: -.065em; white-space: nowrap; }
.hero-subtitle { margin: 0 0 15px; font-family: var(--display-font); font-size: clamp(25px, 2.2vw, 34px); line-height: 1.15; letter-spacing: -.045em; }
.arrival-description { max-width: 370px; margin: 0 0 22px; font-size: 17px; line-height: 1.5; }
.hero-actions { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
.arrival-button { color: var(--ink); background: white; border-color: white; padding-inline: 27px; }
.arrival-link { color: white; font-size: 15px; text-decoration: none; border-bottom: 1px solid currentColor; padding-block: 7px; }
@media (max-width: 1100px) { .home-arrival { grid-template-columns: 1fr; gap: 28px; } .home-arrival h1 { font-size: 15vw; } .arrival-copy { max-width: 600px; } }
@media (max-width: 600px) { .home-hero { min-height: 740px; min-height: 100svh; } .home-arrival { padding: 150px 24px 42px; gap: 24px; } .home-arrival h1 { margin: 0 0 0 -3px; font-size: clamp(76px, 24vw, 110px); line-height: .88; letter-spacing: -.06em; white-space: normal; } .home-arrival h1 span { display: block; } .hero-subtitle { font-size: 26px; max-width: 310px; } .arrival-description { font-size: 16px; max-width: 300px; } .hero-actions { gap: 16px; } .arrival-button { padding-inline: 20px; } .arrival-link { font-size: 14px; } }
</style>
