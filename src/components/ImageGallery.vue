<template>
  <v-row justify="center" align="center" style="background-color: white">
    <v-col cols="12" lg="8" md="10">
      <v-container>
        <v-btn @click="router.replace({ name: 'detail' })" class="mb-3" elevation="1" color="black">
          <v-icon start icon="mdi-arrow-left" />
          Back
        </v-btn>
        <v-row>
          <v-col
            v-for="(item, k) in detailUnit.gambar"
            :key="k"
            class="d-flex child-flex"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <v-img
              :src="imgUrl(item)"
                            :lazy-src="imgUrl(item)"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2 gallery rounded-lg"
              @click="showImage(item)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>

  <!-- Lightbox overlay -->
  <Teleport to="body">
    <div v-if="dataImage" class="overlay" @click="dataImage = null">
      <v-img
        class="lightbox-img"
        :src="dataImage"
        contain
        @click.stop
      >
        <v-btn @click="dataImage = null" class="ma-3" size="small" style="float: right">
          <v-icon icon="mdi-close" />
          Close
        </v-btn>
      </v-img>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const detailUnit = ref(null)
const dataImage = ref(null)

function imgUrl(name) {
  return `/img/units/${name}`
}

function showImage(name) {
  dataImage.value = imgUrl(name)
}

onMounted(() => {
  detailUnit.value = JSON.parse(sessionStorage.getItem('unit'))
  if (!detailUnit.value) {
    router.replace({ name: 'home' }).then(() => router.go())
  }
})
</script>

<style scoped>
.gallery {
  transition: ease-out 0.5s;
  cursor: pointer;
}
.gallery:hover {
  transform: scale(1.05);
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>

<style>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.lightbox-img {
  max-width: 90vw;
  max-height: 90vh;
}
</style>
