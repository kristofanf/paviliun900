<script setup>
import { computed, shallowRef } from 'vue'
import settings from '@/data/settings.json'
import RevealBlock from '@/components/shared/RevealBlock.vue'

const activeIndex = shallowRef(0)
const reviewCount = settings.reviews.length
const visibleReviews = computed(() => Array.from({ length: Math.min(2, reviewCount) }, (_, offset) => settings.reviews[(activeIndex.value + offset) % reviewCount]))
function move(direction) { activeIndex.value = (activeIndex.value + direction + reviewCount) % reviewCount }
</script>

<template>
  <section id="reviews" class="guest-stories section-space" aria-label="Guest stories">
    <RevealBlock>
      <div class="stories-toolbar">
        <span>Guest stories</span>
        <div class="review-controls">
          <button type="button" aria-label="Previous review" :disabled="reviewCount < 2" @click="move(-1)"><i class="mdi mdi-arrow-left" aria-hidden="true" /></button>
          <button type="button" aria-label="Next review" :disabled="reviewCount < 2" @click="move(1)"><i class="mdi mdi-arrow-right" aria-hidden="true" /></button>
        </div>
      </div>
      <div class="stories-grid">
        <h2 class="section-title">A place people<br />come home to.</h2>
        <div :key="activeIndex" class="review-pair" aria-live="polite" aria-atomic="true">
          <figure v-for="review in visibleReviews" :key="review.author" class="review">
            <blockquote>{{ review.text }}</blockquote>
            <figcaption><span aria-hidden="true">—</span> <span data-review-author>{{ review.author }}</span></figcaption>
          </figure>
          <span v-if="!reviewCount">Guest stories are coming soon.</span>
        </div>
      </div>
    </RevealBlock>
  </section>
</template>

<style scoped>
.stories-toolbar { display: flex; justify-content: flex-end; align-items: center; gap: 24px; margin-bottom: 15px; color: var(--muted); font-size: 14px; }
.review-controls { display: flex; gap: 10px; }
.review-controls button { display: grid; place-items: center; width: 42px; height: 42px; border: 0; border-radius: 50%; background: #efefed; color: var(--ink); cursor: pointer; font-size: 20px; transition: background 200ms; }
.review-controls button:hover { background: #dededb; }
.review-controls button:disabled { opacity: .4; cursor: default; }
.stories-grid { display: grid; grid-template-columns: 1fr 1.8fr; gap: 46px; align-items: start; }
.review-pair { display: grid; grid-template-columns: 1fr 1fr; min-height: 200px; animation: story-in 250ms ease-out; }
.review { margin: 0; padding: 15px 28px 0 0; }
.review + .review { border-left: 1px solid var(--line); padding-left: 28px; padding-right: 0; }
.review blockquote { font-family: var(--display-font); font-size: 22px; color: var(--muted); line-height: 1.5; margin: 0; }
.review figcaption { margin-top: 18px; display: flex; gap: 14px; color: var(--muted); font-size: 14px; }
@keyframes story-in { from { opacity: .5; } to { opacity: 1; } }
@media (max-width: 800px) { .stories-grid { grid-template-columns: 1fr; gap: 28px; } }
@media (max-width: 500px) { .stories-toolbar { margin-bottom: 24px; } .review-pair { grid-template-columns: 1fr; gap: 28px; min-height: 350px; } .review { padding: 0; } .review + .review { border-left: 0; border-top: 1px solid var(--line); padding: 24px 0 0; } .review blockquote { font-size: 21px; } }
@media (prefers-reduced-motion: reduce) { .review-pair { animation: none; } .review-controls button { transition: none; } }
</style>
