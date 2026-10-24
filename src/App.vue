<script setup>
import FooterSection from '@/components/FooterSection.vue'
import SiteHeader from '@/components/shared/SiteHeader.vue'
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <SiteHeader />
  <main id="main-content" tabindex="-1"><RouterView /></main>
  <FooterSection />
</template>
