<script setup>
import { computed, shallowRef } from 'vue'
import units from '@/data/units.json'
import { isNightly, rentalPeriods, whatsappUrl } from '@/utils/property'
import HomeUnitPreview from './HomeUnitPreview.vue'
import RevealBlock from '@/components/shared/RevealBlock.vue'

const shortStays = computed(() => units.filter(isNightly))
const longStays = computed(() => units.filter(unit => !isNightly(unit)))
const periods = computed(() => rentalPeriods(longStays.value))
const selectedPeriod = shallowRef(periods.value.includes('year') ? 'year' : periods.value[0])
const periodLabel = period => period === 'year' ? 'Yearly' : period === 'month' ? 'Monthly' : period
</script>

<template>
  <div id="units" class="accommodation">
    <section id="short-stays" class="short-stays" aria-label="Short stays">
      <RevealBlock>
        <h2 class="section-title stays-heading">A few nights, a place of your own.</h2>
        <HomeUnitPreview v-for="unit in shortStays" :key="unit.id" :unit="unit" :period="unit.harga.find(tier => ['night', 'malam'].includes(tier.satuan))?.satuan" featured />
      </RevealBlock>
    </section>
    <section id="long-stays" class="long-stays section-space" aria-label="Long-term living">
      <RevealBlock>
        <h2 id="long-stays-heading" class="section-title">More than a visit. A place to live.</h2>
        <p class="rental-intro">Fully furnished apartments for longer stays in central Yogyakarta.</p>
        <div class="period-options" role="group" aria-label="Rental period">
          <button v-for="period in periods" :key="period" type="button" :aria-pressed="selectedPeriod === period" @click="selectedPeriod = period">{{ periodLabel(period) }}</button>
        </div>
      </RevealBlock>
      <div class="rental-grid" :class="{ 'expanded-grid': longStays.length > 4 }">
        <RevealBlock v-for="unit in longStays" :key="unit.id">
          <HomeUnitPreview :unit="unit" :period="selectedPeriod" />
        </RevealBlock>
      </div>
      <div class="availability-note">
        <p>Contact us about upcoming availability.</p>
        <a class="text-link" :href="whatsappUrl('Hello, I would like to check upcoming availability at Paviliun 900.')" target="_blank" rel="noopener noreferrer">Check availability <i class="mdi mdi-arrow-right" aria-hidden="true" /></a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stays-heading { margin-bottom: 40px; }
.rental-intro { font-family: var(--display-font);font-weight:400; font-size: clamp(23px, 2.2vw, 32px); margin: 12px 0 30px; line-height: 1.35; }
.period-options { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 42px; }
.period-options button { min-width: 148px; border: 1px solid #aaa; border-radius: 4px; padding: 14px 26px; font: inherit; font-size: 15px; color: var(--ink); background: transparent; cursor: pointer; }
.period-options button[aria-pressed='true'] { background: var(--ink); color: white; border-color: var(--ink); }
.rental-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: start; }
.rental-grid > :nth-child(even) { padding-top: 62px; }
.rental-grid.expanded-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.rental-grid.expanded-grid > :nth-child(even) { padding-top: 0; }
.availability-note { margin-top: 65px; padding-top: 38px; border-top: 1px solid var(--line); display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.availability-note p { font-family: var(--display-font);font-weight:400; font-size: clamp(25px, 2.7vw, 38px); line-height: 1.2; margin: 0; }
.availability-note a { flex-shrink: 0; }
@media (max-width: 1100px) { .rental-grid.expanded-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) { .rental-grid, .rental-grid.expanded-grid { grid-template-columns: 1fr; gap: 44px; } .rental-grid > :nth-child(even) { padding-top: 0; } .period-options { gap: 8px; } .period-options button { min-width: 0; flex: 1; padding: 12px 10px; } .stays-heading { margin-bottom: 26px; } .availability-note { flex-direction: column; align-items: start; margin-top: 40px; gap: 20px; } }
</style>
