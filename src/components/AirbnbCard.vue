<template>
  <v-row justify="center" style="margin-bottom: 1rem">
    <v-col
      class="unit-card"
      cols="12"
      lg="4"
      md="6"
      v-for="(unit, i) in deskripsi"
      :key="unit.id"
      style="margin: 0 0.5rem"
    >
      <v-carousel
        hide-delimiter-background
        cycle
        show-arrows="hover"
        height="280"
      >
        <v-carousel-item
          v-for="(img, k) in unit.gambar.slice(0, 5)"
          :key="k"
          :src="getImageSrc(img.src)"
          cover
        >
          <v-container fill-height fluid class="pa-0 ma-0 pb-3">
            <v-layout>
              <v-card :color="unit.tag === 'Available' ? 'white' : '#777b7e'" class="pa-2 ma-2">
                <span :class="unit.tag === 'Available' ? 'text-black' : 'text-white'" class="text-body-1">
                  {{ unit.tag }}
                </span>
              </v-card>
            </v-layout>
          </v-container>
        </v-carousel-item>
      </v-carousel>

      <div class="pa-3" @click="sendData(unit)" style="cursor: pointer">
        <p style="font-weight: 700" v-html="unit.fitur"></p>
        <h2 style="font-weight: 500">{{ unit.judul }}</h2>
        <hr style="width: 50%; font-weight: 600" />
        <div class="isi mt-2">
          <p class="deskripsi">{{ unit.desc }}</p>
          <h3 style="color: #5c5c5c" class="mt-2">{{ unit.harga }}</h3>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAirbnbImage } from '@/utils/images'

const router = useRouter()

const deskripsi = reactive([
  {
    id: 1,
    judul: 'Spacious and Comfortable Airbnb',
    fitur: '4 bedrooms &emsp; 8 guests &emsp; 2 bathrooms &emsp; free Wi-Fi',
    desc: 'Paviliun 900 airbnb location is in the center of Jogja so there are many places you can visit. Paviliun 900 airbnb has 4 bedrooms, 2 bathrooms, kitchen, and one big livingroom for you to enjoy your time with your family',
    harga: 'Rp.1.000.000/malam',
    tamu: '8',
    tag: 'Available',
    detail: 'Our Airbnb located in quiet and green area near UGM and UNY campuses. The master bedroom is very spacious with ensuite bathroom. The other 3 bedrooms can accommodate up to 6 people with comfort. Bedrooms are well lit and provided with working desk to support WFH. The living and dining areas are spacious, cozy, suitable for small gatherings. The kitchen provides a gas stove, microwave, and a big refrigerator.',
    gambar: [
      { src: 'airbnbTengah' },
      { src: 'dapur' },
      { src: 'master' },
      { src: 'tengah' },
      { src: 'master2' },
      { src: 'hall' },
      { src: 'kamar2' },
      { src: 'kamar3' },
      { src: 'kamar4' },
      { src: 'km1' },
      { src: 'dapur1' },
    ],
    fasilitas: [
      { nama: '4 Bedrooms', ikon: 'mdi:bed-outline' },
      { nama: '2 Bathrooms', ikon: 'teenyicons:bath-outline' },
      { nama: 'Smart TV 55"', ikon: 'pixelarticons:device-tv-smart' },
      { nama: 'Kitchen', ikon: 'fa6-solid:kitchen-set' },
      { nama: 'Wifi', ikon: 'iconoir:wifi' },
      { nama: 'Air Conditioning', ikon: 'tabler:air-conditioning' },
      { nama: 'Free Washer', ikon: 'fluent:washer-24-regular' },
      { nama: 'Free Parking (2 Cars)', ikon: 'ph:car' },
      { nama: 'Water Heater', ikon: 'material-symbols:water-heater-outline' },
      { nama: 'Refrigerator', ikon: 'ep:refrigerator' },
      { nama: 'Microwave', ikon: 'material-symbols:microwave-outline' },
    ],
    rules: [
      { aturan: 'No Smoking', ikon: 'mdi:no-smoking' },
      { aturan: 'Check-in: 2:00 PM - 7:00PM', ikon: 'icon-park-outline:check-in' },
      { aturan: 'Checkout before 12:00PM', ikon: 'ri:time-line' },
      { aturan: '8 guests maximum', ikon: 'fluent:people-20-regular' },
    ],
    order: [
      { detail: 'Whatsapp', link: 'https://wa.me/6285888815722?text=Halo%20saya%20mau%20pesan%20airbnb%20Paviliun900', ikon: 'la:whatsapp' },
      { detail: 'Airbnb', link: 'https://www.airbnb.com/rooms/41101697', ikon: 'fa-brands:airbnb' },
    ],
  },
  {
    id: 2,
    judul: 'Exclusive and Strategic Apartment',
    fitur: '3 bedrooms &emsp; 6 guests &emsp; 2 bathrooms',
    tamu: '6',
    desc: 'Exclusive 3 bedrooms unit apartment in the center of Jogja that fully furnished. This unit is for you that need a place for long term stay in Jogja and live comfortably',
    detail: 'This unit is designed with modern and minimalistic style and has 3 bedrooms, 2 bathrooms, kitchen, and livingroom. All of our units is fully furnished and comes with AC for each bedroom and hot water for bathroom. You will live in quiet and exclusive area in the center of Yogyakarta. Paviliun 900 location is near UGM, UNY, UKDW, and Panti Rapih hospital.',
    harga: 'Rp.50.000.000/tahun',
    tag: 'Not Available',
    gambar: [
      { src: 'b21-LivingRoom' },
      { src: 'b21-dapur' },
      { src: 'b21-masterBed' },
      { src: 'b21-KMM' },
      { src: 'b21-Koridor' },
    ],
    fasilitas: [
      { nama: '3 Bedrooms', ikon: 'mdi:bed-outline' },
      { nama: '2 Bathrooms', ikon: 'teenyicons:bath-outline' },
      { nama: 'Smart TV 32"', ikon: 'pixelarticons:device-tv-smart' },
      { nama: 'Kitchen', ikon: 'fa6-solid:kitchen-set' },
      { nama: 'Wifi**', ikon: 'iconoir:wifi' },
      { nama: 'Air Conditioning', ikon: 'tabler:air-conditioning' },
      { nama: 'Washer', ikon: 'fluent:washer-24-regular' },
      { nama: 'Free Parking (1 Car)', ikon: 'ph:car' },
      { nama: 'Water Heater', ikon: 'material-symbols:water-heater-outline' },
      { nama: 'Refrigerator', ikon: 'ep:refrigerator' },
      { nama: 'Microwave', ikon: 'material-symbols:microwave-outline' },
    ],
    rules: [
      { aturan: 'No Smoking', ikon: 'mdi:no-smoking' },
      { aturan: '6 guests maximum', ikon: 'fluent:people-20-regular' },
    ],
    order: [
      { detail: 'Whatsapp', link: 'https://wa.me/6285888815722?text=Halo%20saya%20mau%20pesan%20airbnb%20Paviliun900', ikon: 'la:whatsapp' },
    ],
  },
])

function getImageSrc(name) {
  return getAirbnbImage(name)
}

function sortedArray() {
  deskripsi.sort((a, b) => a.tag.toUpperCase().localeCompare(b.tag.toUpperCase()))
}

function sendData(unit) {
  sessionStorage.setItem('unit', JSON.stringify(unit))
  router.push({ name: 'detail' })
}

onMounted(() => {
  sortedArray()
})
</script>

<style scoped>
.isi {
  margin-bottom: 3rem;
}
.unit-card {
  transition: ease-out 0.5s;
}
.unit-card:hover {
  transform: scale(1.03);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
@media only screen and (max-width: 960px) {
  .unit-card {
    margin: 0 !important;
  }
}
</style>
