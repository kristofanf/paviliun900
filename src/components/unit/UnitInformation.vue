<script setup>
import { computed, shallowRef, watch } from 'vue'
import { formatRupiah } from '@/utils/format'
import { isNightly, rentalPeriods } from '@/utils/property'
import RevealBlock from '@/components/shared/RevealBlock.vue'
const props = defineProps({ unit: { type: Object, required: true } })
const selected = shallowRef('')
const tiers = computed(() => rentalPeriods([props.unit]).map(period => props.unit.harga.find(tier => tier.satuan === period)))
watch(() => props.unit.id, () => { selected.value = props.unit.harga?.[0]?.satuan || '' }, { immediate: true })
// Source icon systems mapped to the locally bundled MDI font.
const icons = { 'mdi:bed-outline': 'bed-outline', 'teenyicons:bath-outline': 'shower', 'fa6-solid:kitchen-set': 'silverware-fork-knife', 'iconoir:wifi': 'wifi', 'tabler:air-conditioning': 'snowflake', 'fluent:washer-24-regular': 'washing-machine', 'ph:car': 'car-outline', 'material-symbols:water-heater-outline': 'water-thermometer-outline', 'ep:refrigerator': 'fridge-outline', 'material-symbols:microwave-outline': 'microwave', 'mdi:no-smoking': 'smoking-off', 'icon-park-outline:check-in': 'clock-outline', 'ri:time-line': 'clock-outline', 'fluent:people-20-regular': 'account-group-outline' }
function iconFor(item, fallback) { return `mdi mdi-${icons[item.ikon] || fallback}` }
</script>

<template>
  <RevealBlock v-if="tiers.length" class="stay-options">
    <fieldset>
      <legend class="section-title">{{ isNightly(unit) ? 'Your stay.' : 'Choose your stay.' }}</legend>
      <div class="price-options">
        <label v-for="tier in tiers" :key="tier.satuan" class="price-option" :class="{ selected: selected === tier.satuan }">
          <input v-model="selected" type="radio" :name="`stay-period-${unit.id}`" :value="tier.satuan" />
          <span>{{ tier.satuan }}</span><strong>{{ formatRupiah(tier.amount) }}</strong>
        </label>
      </div>
    </fieldset>
  </RevealBlock>
  <nav class="detail-sections" aria-label="Unit information">
    <a href="#overview">Overview</a><a href="#facilities">Facilities</a><a href="#house-rules">House rules</a>
  </nav>
  <RevealBlock tag="section" id="overview" class="information-row overview-row">
    <h2 class="section-title">{{ isNightly(unit) ? 'Space to share. Room to unwind.' : 'Settle in, stay connected.' }}</h2>
    <div class="body-copy"><p>{{ unit.desc }}</p><p>{{ unit.detail }}</p></div>
  </RevealBlock>
  <RevealBlock tag="section" id="facilities" class="information-row">
    <div><p class="eyebrow">Facilities</p><h2 class="section-title">The everyday,<br />taken care of.</h2></div>
    <ul class="facilities-list">
      <li v-for="(item, index) in unit.fasilitas || []" :key="index"><span :class="iconFor(item, item.nama === 'Smart TV 55' ? 'television' : 'check')" aria-hidden="true" /><span>{{ item.nama }}</span></li>
    </ul>
  </RevealBlock>
  <RevealBlock tag="section" id="house-rules" class="information-row">
    <div><p class="eyebrow">House rules</p><h2 class="section-title">Before you arrive.</h2></div>
    <ul class="rules-list">
      <li v-for="(item, index) in unit.rules || []" :key="index"><span :class="iconFor(item, 'information-outline')" aria-hidden="true" /><span>{{ item.aturan }}</span></li>
    </ul>
  </RevealBlock>
  <RevealBlock v-if="unit.order?.length" tag="section" class="enquiry-row">
    <h2 class="section-title">Plan your stay.</h2>
    <div><p class="body-copy">Please contact us to check unit availability.</p><div class="order-links"><a v-for="(order, index) in unit.order" :key="index" class="button button-outline" :href="order.link" target="_blank" rel="noopener noreferrer">{{ order.detail }} <span class="mdi mdi-arrow-top-right" aria-hidden="true" /></a></div></div>
  </RevealBlock>
</template>

<style scoped>
.stay-options { padding-top: 38px; padding-bottom: 36px; }
fieldset { min-width: 0; border: 0; padding: 0; }
legend { margin-bottom: 22px; }
.price-options { max-width: 590px; display: grid; gap: 10px; }
.price-option { display: flex; align-items: center; gap: 16px; padding: 17px 20px; border: 1px solid var(--line); border-radius: 4px; cursor: pointer; }
.price-option.selected { border-color: var(--ink); }
.price-option input { width: 19px; height: 19px; accent-color: var(--ink); flex: 0 0 auto; }
.price-option strong { margin-left: auto; font-size: 15px; font-weight: 500; font-variant-numeric: tabular-nums; }
.detail-sections { display: flex; gap: 42px; border-bottom: 1px solid var(--line); padding-top: 24px; }
.detail-sections a { padding: 0 0 18px; color: var(--muted); text-decoration: none; }
.detail-sections a:first-child { border-bottom: 2px solid var(--ink); color: var(--ink); }
.information-row { display: grid; grid-template-columns: .9fr 1.5fr; gap: 70px; padding-block: 52px; border-bottom: 1px solid var(--line); scroll-margin-top: 100px; }
.information-row .section-title { font-size: clamp(32px, 3.2vw, 48px); }
.body-copy p + p { margin-top: 20px; }
.facilities-list, .rules-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 30px; row-gap: 24px; }
.facilities-list li, .rules-list li { display: flex; align-items: center; gap: 18px; font-size: 15px; line-height: 1.5; }
.mdi { font-size: 28px; flex-shrink: 0; }
.enquiry-row { display: grid; grid-template-columns: .9fr 1.5fr; gap: 70px; padding-block: 58px 84px; }
.order-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.order-links .mdi { font-size: 20px; }
@media (max-width: 760px) {
  .information-row, .enquiry-row { grid-template-columns: 1fr; gap: 28px; padding-block: 40px; }
  .detail-sections { gap: 26px; font-size: 14px; }
  .facilities-list, .rules-list { column-gap: 15px; row-gap: 24px; }
  .facilities-list li, .rules-list li { gap: 12px; font-size: 13px; }
  .price-option { padding: 16px 12px; gap: 12px; font-size: 14px; }
  .price-option strong { font-size: 14px; }
}
</style>
