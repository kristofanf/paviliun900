<template>
  <v-row justify="center" style="margin-bottom: 1rem">
    <v-col
      class="unit-card"
      cols="12"
      lg="4"
      md="6"
      v-for="unit in sortedUnits"
      :key="unit.id"
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
        <div class="fitur-badges mb-2">
          <v-chip v-for="(f, i) in (unit.fitur || [])" :key="i" size="small" variant="outlined" class="mr-1 mb-1">
            {{ f }}
          </v-chip>
          <v-chip v-if="unit.luas" size="small" variant="flat" color="grey-lighten-3" class="mr-1 mb-1">
            {{ unit.luas }} m²
          </v-chip>
        </div>
        <h2 style="font-weight: 500">{{ unit.judul }}</h2>
        <hr style="width: 50%" />
        <div class="mt-2">
          <p>{{ unit.desc }}</p>
          <h3 style="color: #5c5c5c" class="mt-2">
            <template v-if="(unit.harga || []).length > 1">
              Starting from {{ hargaMulaiDari(unit.harga) }}
            </template>
            <template v-else>
              {{ formatHarga(unit.harga?.[0]?.amount, unit.harga?.[0]?.satuan) }}
            </template>
          </h3>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatHarga, hargaMulaiDari } from '@/utils/format'
import unitsData from '@/data/units.json'

const router = useRouter()

const sortedUnits = computed(() => {
  return [...unitsData].sort((a, b) => a.tag.localeCompare(b.tag))
})

function imgUrl(name) { return `/img/units/${name}` }

function goDetail(unit) {
  sessionStorage.setItem('unit', JSON.stringify(unit))
  router.push({ name: 'detail' })
}
</script>

<style scoped>
.fitur-badges { display: flex; flex-wrap: wrap; }
.unit-card { transition: ease-out 0.5s; }
.unit-card:hover { transform: scale(1.03); box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px; }
@media only screen and (max-width: 960px) { .unit-card { margin: 0 !important; } }
</style>
