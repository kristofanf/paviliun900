<template>
  <v-footer class="pa-0">
    <v-container fluid class="pa-0">
      <v-row style="margin-top: 4rem; margin-bottom: 1rem" class="px-4">
        <v-col>
          <h1 class="text-center">Need a place to stay?</h1>
          <h2 class="text-center mt-2">Contact us!</h2>
        </v-col>
      </v-row>
      <v-row justify="center" class="px-4">
        <v-col cols="12" sm="6" md="3" v-for="(kontak, i) in kontaks" :key="i" class="text-center">
          <a :href="kontak.link" target="_blank" class="footer-link">
            <h5>
              <Icon :icon="kontak.icon" :inline="true" width="20" height="20" />
              {{ kontak.keterangan }}
            </h5>
          </a>
        </v-col>
      </v-row>
      <v-row class="mt-10 px-4 pb-4">
        <v-col>
          <h3 class="text-center" style="font-weight: 400; color: #666">
            Hati-hati penipuan dengan menggunakan foto Paviliun 900
          </h3>
          <h3 class="text-center" style="font-weight: 400; color: #666">
            Kontak resmi kami hanya yang tertera pada website Paviliun 900
          </h3>
          <h3 class="text-center" style="font-weight: 400; color: #666">
            Kami tidak bertanggung jawab atas akun lain yang mengatasnamakan Paviliun 900
          </h3>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import { reactive } from 'vue'
import { Icon } from '@iconify/vue'

const kontaks = reactive([
  {
    icon: 'la:whatsapp',
    keterangan: '+62-858-8881-5722',
    link: 'https://wa.me/6285888815722?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900',
  },
  {
    icon: 'mdi-light:email',
    keterangan: 'paviliun900@gmail.com',
    link: 'mailto:paviliun900@gmail.com?subject=Informasi Paviliun900',
  },
  {
    icon: 'fa-brands:airbnb',
    keterangan: 'Airbnb Paviliun 900',
    link: 'https://www.airbnb.com/rooms/41101697',
  },
  {
    icon: 'cil:building',
    keterangan: 'Lamudi Paviliun 900',
    link: 'https://www.lamudi.co.id/-agn-34666/',
  },
])
</script>

<style scoped>
.footer-link {
  text-decoration: none;
  color: black;
  font-size: 1.1rem;
  font-weight: 400;
}
.footer-link:hover {
  color: #333;
  text-decoration: underline;
}
</style>
