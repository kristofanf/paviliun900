<template>
  <v-footer class="pa-0">
    <v-container fluid class="pa-0">
      <v-row class="mt-16 mb-4 px-4">
        <v-col>
          <h1 class="text-center">Need a place to stay?</h1>
          <h2 class="text-center mt-2">Contact us!</h2>
        </v-col>
      </v-row>
      <v-row justify="center" class="px-4">
        <v-col cols="12" sm="6" md="3" v-for="(kontak, i) in contacts" :key="i" class="text-center">
          <a :href="kontak.link" target="_blank" class="footer-link">
            <h5><Icon :icon="kontak.icon" :inline="true" width="20" height="20" /> {{ kontak.label }}</h5>
          </a>
        </v-col>
      </v-row>
      <v-row class="mt-10 px-4 pb-4">
        <v-col><p class="text-center" style="font-weight: 400; color: #666">{{ settings.footer.warning }}</p></v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import settings from '@/data/settings.json'

const contacts = computed(() => [
  { icon: 'la:whatsapp', label: `+${settings.site.whatsapp}`, link: `https://wa.me/${settings.site.whatsapp}?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900` },
  { icon: 'mdi-light:email', label: settings.site.email, link: `mailto:${settings.site.email}?subject=Informasi Paviliun900` },
  { icon: 'fa-brands:airbnb', label: 'Airbnb Paviliun 900', link: settings.site.airbnbUrl },
  { icon: 'cil:building', label: 'Lamudi Paviliun 900', link: settings.site.lamudiUrl },
])
</script>

<style scoped>
.footer-link { text-decoration: none; color: black; font-size: 1.1rem; font-weight: 400; }
.footer-link:hover { color: #333; text-decoration: underline; }
</style>
