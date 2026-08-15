<template>
  <v-row justify="center" class="mt-16 mb-4 px-4">
    <v-col cols="12" class="text-center">
      <h1>Our Location</h1>
      <h3 class="alamat mt-2">{{ settings.location.address }}</h3>
    </v-col>
  </v-row>
  <v-row justify="center" class="px-4">
    <v-col cols="12" lg="6" md="6">
      <iframe
        :src="settings.location.mapEmbed"
        width="100%" height="450" style="border: 0"
        allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
        title="Paviliun 900 Location"
      />
    </v-col>
    <v-col cols="12" lg="6" md="6">
      <ul class="list-maps">
        <li v-for="(item, i) in settings.location.nearby" :key="i" class="item-list">{{ item }}</li>
      </ul>
    </v-col>
  </v-row>
</template>

<script setup>
import settings from '@/data/settings.json'
</script>

<style scoped>
.item-list { margin: 0.8rem 0; font-weight: 400; }
.list-maps { margin-left: 1.5rem; }
.alamat { background-color: black; color: white; padding: 0.6rem; display: inline-block; }
@media only screen and (max-width: 960px) { .list-maps { margin-left: 1rem; } }
</style>
