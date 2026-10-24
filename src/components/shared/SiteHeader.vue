<script setup>
import { computed, useTemplateRef, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import settings from '@/data/settings.json'
import { whatsappUrl } from '@/utils/property'

const route = useRoute()
const menu = useTemplateRef('menu')
const plain = computed(() => route.name === 'about')
const links = [
  { label: 'Our spaces', hash: '#units' },
  { label: 'Long-term rent', hash: '#long-stays' },
  { label: 'Location', hash: '#location' },
  { label: 'Guest stories', hash: '#reviews' },
]
const contact = whatsappUrl('Hello, I would like to check availability at Paviliun 900.')
function closeMenu() { menu.value?.close() }
watch(() => route.fullPath, closeMenu)
onBeforeUnmount(closeMenu)
</script>

<template>
  <header class="site-header" :class="{ 'plain-header': plain }">
    <div class="nav-inner">
      <RouterLink class="site-brand" :to="{ name: 'home' }">{{ settings.site.name }}</RouterLink>
      <nav class="desktop-nav" aria-label="Main navigation">
        <RouterLink v-for="link in links" :key="link.hash" :to="{ name: 'home', hash: link.hash }">{{ link.label }}</RouterLink>
        <a class="header-contact" :href="contact" target="_blank" rel="noopener noreferrer">Check availability</a>
      </nav>
      <button class="menu-trigger" type="button" aria-haspopup="dialog" aria-controls="navigation-menu" @click="menu.showModal()">Menu <i class="mdi mdi-menu" aria-hidden="true" /></button>
    </div>
    <dialog id="navigation-menu" ref="menu" class="menu-dialog" aria-label="Navigation">
      <div class="menu-top"><RouterLink class="site-brand" :to="{ name: 'home' }" @click="closeMenu">{{ settings.site.name }}</RouterLink><button class="close-menu" type="button" aria-label="Close menu" @click="closeMenu">Close <i class="mdi mdi-close" aria-hidden="true" /></button></div>
      <nav aria-label="Mobile navigation">
        <RouterLink v-for="link in links" :key="link.hash" :to="{ name: 'home', hash: link.hash }" @click="closeMenu">{{ link.label }} <i class="mdi mdi-arrow-top-right" aria-hidden="true" /></RouterLink>
        <a class="button" :href="contact" target="_blank" rel="noopener noreferrer" @click="closeMenu">Check availability <i class="mdi mdi-arrow-right" aria-hidden="true" /></a>
      </nav>
      <p class="menu-location">Yogyakarta, Indonesia</p>
    </dialog>
  </header>
</template>

<style scoped>
.site-header{position:absolute;z-index:20;inset:0 0 auto;color:#fff}.nav-inner{width:89%;height:98px;margin-inline:auto;display:flex;align-items:center;justify-content:space-between;gap:30px;border-bottom:1px solid #ffffff55}.site-brand{font-size:30px;font-weight:500;letter-spacing:-1.4px;text-decoration:none;white-space:nowrap}.desktop-nav{display:flex;align-items:center;gap:34px;font-size:15px}.desktop-nav a{text-decoration:none}.desktop-nav a:not(.header-contact):hover{text-decoration:underline}.header-contact{background:#fff;color:#181818;border-radius:4px;padding:13px 29px;white-space:nowrap}.menu-trigger{display:none;align-items:center;gap:12px;border:0;background:none;color:inherit;font-size:18px;padding:12px 0}.menu-trigger .mdi{font-size:26px}.plain-header{color:var(--ink)}.plain-header .nav-inner{border-color:var(--line)}.plain-header .header-contact{background:var(--ink);color:#fff}.menu-dialog{position:fixed;inset:0;width:100%;height:100dvh;max-width:none;max-height:none;border:0;padding:0 24px;margin:0}.menu-top{display:flex;align-items:center;justify-content:space-between;height:90px;border-bottom:1px solid var(--line)}.menu-top .site-brand{font-size:24px}.close-menu{display:flex;gap:12px;align-items:center;border:0;background:none;color:var(--ink);font-size:16px;padding:12px 0}.menu-dialog nav{display:flex;flex-direction:column;align-items:stretch;gap:30px;padding-block:64px}.menu-dialog nav>a:not(.button){display:flex;justify-content:space-between;align-items:center;font-family:var(--display-font);font-size:clamp(30px,9vw,44px);text-decoration:none;letter-spacing:-1px}.menu-dialog nav .button{align-self:start;margin-top:24px}.menu-location{color:var(--muted);font-size:14px}.menu-dialog nav .mdi{font-size:24px}
@media(max-width:900px){.desktop-nav{gap:20px;font-size:13px}.header-contact{padding:12px 18px}.site-brand{font-size:26px}}
@media(max-width:900px){.desktop-nav{display:none}.menu-trigger{display:flex}.nav-inner{width:calc(100% - 48px);height:82px}.site-brand{font-size:25px}}
</style>
