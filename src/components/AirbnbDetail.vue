<template>
  <!-- Hero -->
  <v-row justify="center" align="center" class="detail-hero">
    <v-col cols="12" lg="8" md="10">
      <v-container fluid>
        <v-btn @click="router.replace({ name: 'home' })" variant="text" color="black" class="mb-4 back-btn">
          <v-icon start icon="mdi-arrow-left" />
          Kembali
        </v-btn>

        <h1 class="detail-title">{{ detailUnit.judul }}</h1>
        <div class="fitur-row mb-3">
          <v-chip v-for="(f, i) in (detailUnit.fitur || [])" :key="i" size="small" variant="flat" color="grey-lighten-3" class="mr-1 mb-1">
            {{ f }}
          </v-chip>
        </div>
        <h3 class="detail-price">
          {{ detailUnit.tamu }} Guests
        </h3>

        <!-- Pricing Tiers -->
        <div class="pricing-section mt-4">
          <div class="pricing-table">
            <div
              v-for="(tier, i) in (detailUnit.harga || [])"
              :key="i"
              class="pricing-row"
              :class="{ 'pricing-best': i === 0 && detailUnit.harga.length > 1 }"
            >
              <span class="pricing-label">
                <template v-if="i === 0 && detailUnit.harga.length > 1">Best Value</template>
                <template v-else>{{ tier.satuan }}</template>
              </span>
              <span class="pricing-amount">{{ formatRupiah(tier.amount) }}</span>
              <span class="pricing-unit">/{{ tier.satuan }}</span>
            </div>
          </div>
        </div>

        <v-row class="mt-6">
          <v-col cols="12" lg="8" md="8">
            <v-img
              :src="imgUrl(detailUnit.gambar[0])"
              cover
              height="100%"
              min-height="300"
              class="rounded-xl main-photo"
            />
          </v-col>
          <v-col cols="12" lg="4" md="4" class="d-flex" style="flex-direction: column; gap: 4px">
            <v-img
              class="flex-grow-1 rounded-xl"
              :src="imgUrl(detailUnit.gambar[1])"
              height="200"
              cover
            />
            <v-img
              class="flex-grow-1 rounded-xl"
              :src="imgUrl(detailUnit.gambar[2])"
              cover
              height="200"
            >
              <v-btn
                @click="router.push({ name: 'image' })"
                class="ma-2"
                size="small"
                color="white"
                style="position: absolute; bottom: 0; right: 0"
              >
                Show all Photos
              </v-btn>
            </v-img>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>

  <!-- Description -->
  <section class="section-appear">
    <div class="section-inner">
      <p class="desc-text">{{ detailUnit.detail }}</p>
    </div>
  </section>

  <!-- Divider -->
  <div class="section-divider" />

  <!-- Facilities -->
  <section class="section-appear">
    <div class="section-inner">
      <h2 class="section-heading">Our Facilities</h2>
      <div class="fac-grid">
        <div
          v-for="(item, n) in detailUnit.fasilitas"
          :key="n"
          class="fac-card"
        >
          <div class="fac-icon">
            <Icon :icon="item.ikon" width="28" height="28" />
          </div>
          <span class="fac-label">{{ item.nama }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="section-divider" />

  <!-- House Rules -->
  <section class="section-appear">
    <div class="section-inner">
      <h2 class="section-heading">House Rules</h2>
      <div class="rules-grid">
        <div
          v-for="(item, n) in detailUnit.rules"
          :key="n"
          class="rule-item"
        >
          <Icon :icon="item.ikon" width="22" height="22" class="rule-icon" />
          <span>{{ item.aturan }}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Divider -->
  <div class="section-divider" />

  <!-- Order -->
  <section class="section-appear">
    <div class="section-inner" style="text-align: center">
      <h2 class="section-heading">How to Order</h2>
      <div class="order-row">
        <a
          v-for="order in detailUnit.order"
          :key="order.detail"
          :href="order.link"
          target="_blank"
          class="order-btn"
        >
          <Icon :icon="order.ikon" width="20" height="20" />
          <span>{{ order.detail }}</span>
        </a>
      </div>
      <p class="order-note">*Please contact us to check unit availability</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { formatHarga, formatRupiah } from '@/utils/format'

const router = useRouter()
const detailUnit = ref(null)

function imgUrl(name) {
  return `/img/units/${name}`
}

function reveal() {
  const reveals = document.querySelectorAll('.section-appear')
  const windowHeight = window.innerHeight
  for (const el of reveals) {
    const elementTop = el.getBoundingClientRect().top
    if (elementTop < windowHeight - 100) {
      el.classList.add('active')
    }
  }
}

onMounted(() => {
  detailUnit.value = JSON.parse(sessionStorage.getItem('unit'))
  if (!detailUnit.value) {
    router.replace({ name: 'home' }).then(() => router.go())
    return
  }
  window.addEventListener('scroll', reveal)
  reveal()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', reveal)
})
</script>

<style scoped>
/* ── Hero ── */
.detail-hero {
  background: #fafafa;
  padding-bottom: 2rem;
}
.back-btn {
  font-size: .85rem;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}
.detail-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: #111;
}
.detail-price {
  font-weight: 500;
  color: #555;
  font-size: 1.05rem;
}
.main-photo {
  box-shadow: 0 4px 24px rgba(0,0,0,.06);
}

/* ── Sections ── */
.section-appear {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.section-appear.active {
  opacity: 1;
  transform: translateY(0);
}
.section-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}
.section-heading {
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -0.01em;
  color: #111;
}
.section-divider {
  max-width: 900px;
  margin: 0 auto;
  height: 1px;
  background: #e8e8e8;
}

/* ── Description ── */
.desc-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #444;
  text-align: center;
  max-width: 720px;
  margin: 0 auto;
}

/* ── Facilities Grid ── */
.fac-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}
.fac-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}
.fac-card:hover {
  border-color: #ddd;
  box-shadow: 0 2px 12px rgba(0,0,0,.04);
  transform: translateY(-1px);
}
.fac-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #eee;
  flex-shrink: 0;
  color: #222;
}
.fac-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #333;
  line-height: 1.3;
}

/* ── Rules ── */
.rules-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 480px;
  margin: 0 auto;
}
.rule-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
}
.rule-item:hover {
  border-color: #ddd;
  background: #fff;
}
.rule-icon {
  color: #555;
  flex-shrink: 0;
}

/* ── Order ── */
.order-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.order-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  background: #111;
  color: #fff;
  text-decoration: none;
  font-size: .9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
.order-btn:hover {
  background: #333;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,0,0,.15);
}
.order-note {
  font-size: .8rem;
  color: #999;
  margin-top: 0.5rem;
}

/* ── Pricing ── */
.pricing-table {
  max-width: 380px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}
.pricing-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}
.pricing-row:last-child { border-bottom: none; }
.pricing-label {
  font-size: .85rem;
  color: #666;
  min-width: 80px;
}
.pricing-amount {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
  flex: 1;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.pricing-unit {
  font-size: .8rem;
  color: #999;
}
.pricing-best {
  background: #111;
  color: #fff;
}
.pricing-best .pricing-label {
  color: #25D366;
  font-weight: 600;
  font-size: .75rem;
  text-transform: uppercase;
  letter-spacing: .04em;
}
.pricing-best .pricing-amount {
  color: #fff;
}
.pricing-best .pricing-unit {
  color: rgba(255,255,255,.5);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .fac-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  .fac-card {
    padding: 10px 12px;
    gap: 8px;
  }
  .fac-icon {
    width: 34px;
    height: 34px;
  }
  .section-inner {
    padding: 2rem 1rem;
  }
  .section-heading {
    font-size: 1.15rem;
  }
}
</style>
