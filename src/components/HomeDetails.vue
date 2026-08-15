<template>
  <div ref="detailsRef">
    <v-row style="margin-top: 10%; margin-bottom: 10%">
      <v-col cols="12" md="6">
        <v-img
          :src="lorongImg"
          height="500"
          width="100%"
          :aspect-ratio="1"
          cover
          class="lahan"
        />
      </v-col>
      <v-col class="d-flex justify-center align-center" cols="12" md="6">
        <div>
          <h2 v-if="!isMobile" class="text-center" style="font-weight: 300">
            Paviliun 900 is a new living experience with affordable price, modern style of living, and suitable for you who wants to live comfortably on the center of Jogja.
          </h2>
          <h4 v-else class="ma-5 text-center" style="font-weight: 300; font-size: 1rem">
            Paviliun 900 is a new living experience with affordable price, modern style of living, and suitable for you who wants to live comfortably on the center of Jogja.
          </h4>
        </div>
      </v-col>
    </v-row>

    <div class="appear">
      <v-card class="mx-auto" max-width="auto" flat>
        <v-container fluid style="background-color: #fff">
          <div style="width: 100%; margin: 2rem">
            <h2 class="text-center" style="font-weight: 500; font-size: 2rem">UNITS FOR RENT</h2>
          </div>
          <AirbnbCard />
        </v-container>
        <v-container>
          <MapsCard />
        </v-container>
        <v-container>
          <ReviewCard />
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AirbnbCard from './AirbnbCard.vue'
import MapsCard from './MapsCard.vue'
import ReviewCard from './ReviewCard.vue'
import lorongImg from '@/assets/lorong.jpg'

const isMobile = ref(false)
const detailsRef = ref(null)

function onResize() {
  isMobile.value = window.innerWidth < 600
}

function reveal() {
  const reveals = document.querySelectorAll('.appear')
  const windowHeight = window.innerHeight
  for (const el of reveals) {
    const elementTop = el.getBoundingClientRect().top
    if (elementTop < windowHeight - 200) {
      el.classList.add('active')
    } else {
      el.classList.remove('active')
    }
  }
}

onMounted(() => {
  onResize()
  reveal()
  window.addEventListener('scroll', reveal)
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', reveal)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.appear {
  position: relative;
  transform: translateY(150px);
  opacity: 0;
  transition: 2s all ease;
}
.appear.active {
  transform: translateY(0);
  opacity: 1;
}
.lahan {
  transition: all 0.5s ease-in-out;
}
.lahan:hover {
  transform: scale(1.05);
}
</style>
