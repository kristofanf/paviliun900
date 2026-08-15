<template>
  <h1 style="margin-top: 4rem" class="text-center">What our guests say</h1>
  <swiper
    class="swiper px-4"
    :modules="modules"
    :pagination="{ clickable: true }"
    :space-between="16"
    :slides-per-view="1"
    :autoplay="{ delay: 4000, disableOnInteraction: false }"
    :breakpoints="{
      600: { slidesPerView: 2, spaceBetween: 16 },
      1024: { slidesPerView: 3, spaceBetween: 20 },
    }"
  >
    <swiper-slide v-for="(item, i) in settings.reviews" :key="i" class="slide">
      <div class="review pa-4">
        <h3 class="text-center" style="font-weight: 400; font-style: italic">{{ item.text }}</h3>
        <p class="text-center mt-4" style="font-weight: 600">— {{ item.author }}</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules'
import settings from '@/data/settings.json'

const modules = [Navigation, Pagination, Scrollbar, Autoplay]
</script>

<style scoped>
.slide { height: auto; margin: 2rem 0; background-color: white; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,.08); min-height: 200px; display: flex; align-items: center; }
.review { min-height: 180px; display: flex; flex-direction: column; justify-content: center; }
</style>
