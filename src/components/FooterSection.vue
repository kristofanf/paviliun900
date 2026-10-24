<script setup>
import settings from '@/data/settings.json'
import { whatsappUrl } from '@/utils/property'
import RevealBlock from '@/components/shared/RevealBlock.vue'
const contact = whatsappUrl('Hello, I would like to check availability at Paviliun 900.')
</script>

<template>
  <footer id="contact" class="site-footer page-width">
    <RevealBlock class="footer-contact">
      <div><h2 class="section-title">Find your place in Jogja.</h2><a class="button" :href="contact" target="_blank" rel="noopener noreferrer">Check availability <i class="mdi mdi-arrow-right" aria-hidden="true" /></a></div>
      <address class="contact-options">
        <a :href="contact" target="_blank" rel="noopener noreferrer"><i class="mdi mdi-whatsapp" aria-hidden="true" /><span>WhatsApp +{{ settings.site.whatsapp }}</span></a>
        <a :href="`mailto:${settings.site.email}`"><i class="mdi mdi-email-outline" aria-hidden="true" /><span>{{ settings.site.email }}</span></a>
        <a :href="settings.site.airbnbUrl" target="_blank" rel="noopener noreferrer"><i class="mdi mdi-airbnb" aria-hidden="true" /><span>Airbnb {{ settings.site.name }}</span></a>
      </address>
    </RevealBlock>
    <div class="footer-bottom"><RouterLink class="footer-brand" :to="{name:'home'}">{{ settings.site.name }}</RouterLink><p>{{ settings.footer.warning }}</p></div>
  </footer>
</template>

<style scoped>
.site-footer{border-top:1px solid var(--line);padding-block:54px 40px}.footer-contact{display:grid;grid-template-columns:1.2fr 1fr;gap:60px;align-items:center;padding-bottom:54px}.footer-contact .section-title{font-size:clamp(36px,4.4vw,66px);margin-bottom:28px}.contact-options{font-style:normal;display:grid;gap:22px;padding-left:60px;border-left:1px solid var(--line)}.contact-options a{display:flex;align-items:center;gap:24px;font-size:16px;text-decoration:none;overflow-wrap:anywhere}.contact-options a:hover{text-decoration:underline}.contact-options .mdi{font-size:26px;flex-shrink:0}.footer-bottom{border-top:1px solid var(--line);padding-top:34px;display:flex;align-items:start;justify-content:space-between;gap:60px}.footer-brand{font-size:29px;letter-spacing:-1.3px;line-height:1.2;text-decoration:none;white-space:nowrap}.footer-bottom p{font-size:11px;line-height:1.7;color:var(--muted);max-width:650px}
@media(max-width:700px){.site-footer{padding-top:38px}.footer-contact{grid-template-columns:1fr;gap:40px;padding-bottom:40px}.contact-options{border-left:0;border-top:1px solid var(--line);padding:30px 0 0;gap:22px}.contact-options a{font-size:14px;gap:16px}.footer-bottom{flex-direction:column;gap:28px}.footer-contact .section-title{font-size:38px}.footer-brand{font-size:25px}}
</style>
