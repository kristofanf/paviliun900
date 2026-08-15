<template>
  <VLayoutItem model-value position="bottom" size="100" style="width: fit-content">
    <div class="ma-4">
      <a :href="waLink" target="_blank">
        <v-btn size="large" elevation="8" class="float-btn">
          <v-icon icon="mdi-whatsapp" class="mr-1" />
          <span v-if="!isMobile">Contact Us</span>
        </v-btn>
      </a>
    </div>
  </VLayoutItem>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import settings from '@/data/settings.json'

const isMobile = ref(false)
const waLink = computed(() => `https://wa.me/${settings.site.whatsapp}?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900`)

function onResize() { isMobile.value = window.innerWidth < 600 }
onMounted(() => { onResize(); window.addEventListener('resize', onResize, { passive: true }) })
onBeforeUnmount(() => { window.removeEventListener('resize', onResize) })
</script>

<style scoped>
.float-btn { background-color: #25D366; color: white; }
.float-btn:hover { background-color: #1da851; }
</style>
