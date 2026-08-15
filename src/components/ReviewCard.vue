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
    <swiper-slide v-for="(item, i) in reviews" :key="i" class="slide">
      <div class="review pa-4">
        <h3 class="text-center text-body-1" style="font-weight: 400; font-style: italic">
          {{ item.isi }}
        </h3>
        <p class="text-center mt-4" style="font-weight: 600">— {{ item.penulis }}</p>
      </div>
    </swiper-slide>
  </swiper>
</template>

<script setup>
import { reactive } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules'

const modules = [Navigation, Pagination, Scrollbar, Autoplay]

const reviews = reactive([
  { isi: '"Comfy place to stay, Fair rate!"', penulis: 'Agung Nugroho' },
  { isi: '"Mewah, aman, nyaman, tenang..great place to stay"', penulis: 'Michel Aaron' },
  { isi: '"Tempat tinggal yang nyaman, aman dan lokasi yang strategis"', penulis: 'Agus Soelistiono' },
  { isi: '"Best airbnb in jogja so far. good location, spacious and clean. very recommended."', penulis: 'Tegar' },
  { isi: '"Worth every penny that I paid, the place is very clean, spacy living room and bedrooms. The surroundings is also comfortable, very quiet at night, so we traveller can rest really well."', penulis: 'Yodivan' },
  { isi: '"We felt right at home in Henry\'s place, the place is also quiet so we could sleep well. It is very clean so it is comfortable. Living room is spacious enough to have gathering with family. All in all recommended."', penulis: 'Lydia' },
])
</script>

<style scoped>
.slide {
  height: auto;
  margin: 2rem 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  min-height: 200px;
  display: flex;
  align-items: center;
}
.review {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
