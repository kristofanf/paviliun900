<template>
  <v-app>
    <v-main style="background-color: #F5F5F5">
      <router-view />
      <FloatButton />
      <FooterSection />
    </v-main>
  </v-app>
</template>

<script setup>
import FooterSection from '@/components/FooterSection.vue'
import FloatButton from '@/components/FloatButton.vue'
</script>
