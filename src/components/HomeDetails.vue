
<template>
    <div :class="{appear: !isMobile}">
        <v-row style="margin-top: 10%;margin-bottom: 10%;">
            <v-col cols="12" md="6" lg="6" xl="6">
                <v-img
                    src="../assets/lorong.jpg"
                    height="500"
                    width="100%"
                    :aspect-ratio="1"
                    cover
                    class="lahan"
                ></v-img>
            </v-col>
            <v-col class="d-flex justify-center align-center" cols="12" md="6" lg="6" xl="6">
                <div>
                    <h2 v-if="!isMobile" style="text-align:center; font-weight:300;">Pavilun 900 is a new living experience with affordable price, modern style of living. and suitable for you who wants to live comfortably on the center of Jogja.</h2>
                    <h4 v-if="isMobile" class="ma-5" style="text-align:center; font-weight:300;">Pavilun 900 is a new living experience with affordable price, modern style of living. and suitable for you who wants to live comfortably on the center of Jogja.</h4>
                </div>
            </v-col>
            <!-- <div style="width:100%; margin: 2rem;"><p class="text-center text-h4">Need a Place to Stay?</p></div> -->
        </v-row>
    </div>
     
    <div class="appear">
        <v-card
        class="mx-auto"
        max-width="auto"
        flat
    >
            <v-container fluid style="background-color: #fff">
                <div style="width:100%; margin: 2rem; "><h2 class="text-center justify-center" style="font-weight: 500;font-size: 2rem;">UNITS FOR RENT</h2></div>
                <airbnb-card></airbnb-card>
            </v-container>
            <v-container>
                <maps-card></maps-card>
            </v-container>
            <v-container>
                <review-card></review-card>
            </v-container>
        </v-card>
    </div>
    <div class="appear">

    </div>
</template>

<script>
/* eslint-disable */
import AirbnbCard from './AirbnbCard.vue';
import MapsCard from './MapsCard.vue'
import ReviewCard from './ReviewCard.vue';

export default {
    
    name: 'HomeDetails',
    components:{
        AirbnbCard,
      
        MapsCard,
        ReviewCard
    },
    data(){
        return{
            isMobile : false,
        }
    },
    created(){
        window.addEventListener("scroll", this.reveal);
        this.reveal()
    },
    beforeMount () {
      if (typeof window === 'undefined') return

      window.removeEventListener('resize', this.onResize, { passive: true })
    },
    mounted () {
      this.onResize()
      window.addEventListener('resize', this.onResize, { passive: true })
    },
    methods: {
        reveal(){
            var reveals = document.querySelectorAll(".appear")
            for (var i = 0; i < reveals.length; i++) {
            var windowHeight = window.innerHeight;
            var elementTop = reveals[i].getBoundingClientRect().top;
            var elementVisible = 200;
            if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
            } else {
            reveals[i].classList.remove("active");
            }
            }
        },
        onResize () {
            this.isMobile = window.innerWidth < 600
        },
    },
}

</script>

<style scoped>
.appear{
  position: relative;
  transform: translateY(150px);
  opacity: 0;
  transition: 2s all ease;
}
.appear.active{
  transform: translateY(0);
  opacity: 1;
}
.lahan{
    transition: all .5s ease-in-out; 
}
.lahan:hover{
    transform: scale(1.1);
    
}
</style>