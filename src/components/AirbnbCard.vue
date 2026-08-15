<template>
  <v-row justify="center" style="margin-bottom: 1rem">
    <v-col
      class="unit-card"
      cols="12"
      lg="4"
      md="6"
      v-for="unit in sortedUnits"
      :key="unit.id"
      style="margin: 0 0.5rem"
    >
      <v-carousel hide-delimiter-background cycle show-arrows="hover" height="280">
        <v-carousel-item
          v-for="(img, k) in (unit.gambar || []).slice(0, 5)"
          :key="k"
          :src="imgUrl(img)"
          cover
        >
          <v-container fill-height fluid class="pa-0 ma-0 pb-3">
            <v-layout>
              <v-card :color="unit.tag === 'Available' ? 'white' : '#777b7e'" class="pa-2 ma-2">
                <span :class="unit.tag === 'Available' ? 'text-black' : 'text-white'" class="text-body-1">
                  {{ unit.tag }}
                </span>
              </v-card>
            </v-layout>
          </v-container>
        </v-carousel-item>
      </v-carousel>

      <div class="pa-3" @click="goDetail(unit)" style="cursor: pointer">
        <p style="font-weight: 700" v-html="unit.fitur"></p>
        <h2 style="font-weight: 500">{{ unit.judul }}</h2>
        <hr style="width: 50%" />
        <div class="mt-2">
          <p>{{ unit.desc }}</p>
          <h3 style="color: #5c5c5c" class="mt-2">{{ unit.harga }}</h3>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import unitsData from '@/data/units.json'

const router = useRouter()

const sortedUnits = computed(() => {
  return [...unitsData].sort((a, b) => a.tag.toUpperCase().localeCompare(b.tag.toUpperCase()))
})

function imgUrl(name) {
  return `/img/units/${name}`
}

function goDetail(unit) {
  sessionStorage.setItem('unit', JSON.stringify(unit))
  router.push({ name: 'detail' })
}
</script>

<style scoped>
.unit-card {
  transition: ease-out 0.5s;
}
.unit-card:hover {
  transform: scale(1.03);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
@media only screen and (max-width: 960px) {
  .unit-card {
    margin: 0 !important;
  }
}
</style>
