<template>
    <VLayoutItem model-value position="bottom" size="100" style="width: fit-content;">
        <div v-if="isMobile" class="ma-4">
            <a href="https://wa.me/6281270853749?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900" target="_blank"><v-btn size="large"  elevation="8" class="float"><v-icon icon="mdi-whatsapp"></v-icon></v-btn></a>
        </div>
        <div v-if="!isMobile" class="ma-4">
            <a href="https://wa.me/6281270853749?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900" target="_blank"><v-btn size="large"  elevation="8" class="float">Contact Us</v-btn></a>
        </div>
    </VLayoutItem>
</template>
<script>
//import { useDisplay } from 'vuetify'
export default {
    name: 'FloatButton',
    data(){
        return{
            isMobile: false
        }
    },
    beforeMount () {
      if (typeof window === 'undefined') return

      window.removeEventListener('resize', this.onResize, { passive: true })
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    methods:{
        onResize () {
            this.isMobile = window.innerWidth < 600
        },
    }
}
</script>

<style scoped>
    .float{
        background-color: black;
        color: white;
    }
</style>