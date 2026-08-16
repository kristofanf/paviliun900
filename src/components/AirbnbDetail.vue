<template>
  <v-row justify="center" align="center" style="background-color: white">
    <v-col cols="12" lg="8" md="10">
      <v-container fluid>
        <v-btn @click="router.replace({ name: 'home' })" elevation="1" color="black" class="mb-4">
          <v-icon start icon="mdi-arrow-left" />
          Kembali
        </v-btn>

        <h1 class="text-start">{{ detailUnit.judul }}</h1>
        <div class="mb-2">
          <v-chip v-for="(f, i) in (detailUnit.fitur || [])" :key="i" size="small" variant="outlined" class="mr-1 mb-1">{{ f }}</v-chip>
        </div>
        <h3 style="font-weight: 500" class="text-start mb-10">
          {{ detailUnit.tamu }} Guests | {{ formatHarga(detailUnit.harga, detailUnit.satuan) }}
        </h3>

        <v-row>
          <v-col cols="12" lg="8" md="8">
            <v-img
              :src="imgUrl(detailUnit.gambar[0])"
              cover
              height="100%"
              min-height="300"
              class="rounded-lg"
            />
          </v-col>
          <v-col cols="12" lg="4" md="4" class="d-flex" style="flex-direction: column">
            <v-img
              class="mb-1 flex-grow-1 rounded-lg"
              :src="imgUrl(detailUnit.gambar[1])"
              height="200"
              cover
            />
            <v-img
              class="flex-grow-1 rounded-lg"
              :src="imgUrl(detailUnit.gambar[2])"
              cover
              height="200"
            >
              <v-btn
                @click="router.push({ name: 'image' })"
                class="ma-2"
                size="small"
                color="white"
                style="position: absolute; bottom: 0; right: 0"
              >
                Show all Photos
              </v-btn>
            </v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>

  <!-- Description -->
  <div class="appear">
    <v-row class="ma-4 ma-md-10" justify="center">
      <v-col cols="12" lg="8" md="10">
        <p class="text-center text-body-1">{{ detailUnit.detail }}</p>
      </v-col>
    </v-row>
  </div>

  <!-- Facilities -->
  <div class="appear">
    <v-row style="margin-top: 4rem" justify="center">
      <h2 class="text-center">Our Facilities</h2>
    </v-row>
    <v-row class="ml-1" justify="center">
      <v-col cols="12">
        <v-row>
          <v-col v-for="(item, n) in detailUnit.fasilitas" :key="n" cols="6" md="4" lg="3">
            <h4 style="font-weight: 400">
              <Icon :icon="item.ikon" :inline="true" width="25" height="25" />&emsp;{{ item.nama }}
            </h4>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>

  <!-- House Rules -->
  <div class="appear">
    <v-row style="margin-top: 4rem" justify="center">
      <h2 class="text-center">House Rules</h2>
    </v-row>
    <v-row class="ml-1" justify="center">
      <v-col cols="12">
        <v-row>
          <v-col v-for="(item, n) in detailUnit.rules" :key="n" cols="6" md="4" lg="3">
            <h4 style="font-weight: 400">
              <Icon :icon="item.ikon" :inline="true" width="25" height="25" />&emsp;{{ item.aturan }}
            </h4>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>

  <!-- Order -->
  <div class="appear">
    <v-row style="margin-top: 4rem" justify="center">
      <h2 class="text-center">How to order</h2>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="auto" v-for="order in detailUnit.order" :key="order.detail">
        <v-btn class="button" style="margin: auto">
          <a class="order-link" :href="order.link" target="_blank">
            <h3><Icon :icon="order.ikon" :inline="true" width="25" height="25" /> {{ order.detail }}</h3>
          </a>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="mb-10">
      <h4 style="font-weight: 400">*Please contact us to check unit availability</h4>
    </v-row>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { formatHarga } from '@/utils/format'

const router = useRouter()
const detailUnit = ref(null)

function imgUrl(name) {
  return `/img/units/${name}`
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
  detailUnit.value = JSON.parse(sessionStorage.getItem('unit'))
  if (!detailUnit.value) {
    router.replace({ name: 'home' }).then(() => router.go())
    return
  }
  window.addEventListener('scroll', reveal)
  reveal()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', reveal)
})
</script>

<style scoped>
.order-link {
  text-decoration: none;
  color: black;
}
.order-link:hover {
  color: white;
}
.button:hover {
  color: white;
  background-color: black;
  transition: ease-in-out 0.4s;
}
.appear {
  position: relative;
  transform: translateY(100px);
  opacity: 0;
  transition: 2s all ease;
}
.appear.active {
  transform: translateY(0);
  opacity: 1;
}
</style>
