<template>
<h1 style="margin-top:4rem;" class="text-center">What our guests say</h1>
    <swiper
        class="swiper"
        :modules="modules"
        :pagination="{ clickable: true }"
        :space-between="10"
        :slides-per-view="1"
        :autoplay="{
            delay: 4000,
            disableOnInteraction: false,
        }"
       :breakpoints="{
            '600': {
                slidesPerView: 2,
                spaceBetween: 10
            },
            '1024': {
                slidesPerView: 3,
                spaceBetween: 10
            }
       }"
    > 
    <swiper-slide class="slide" v-for="(item, i) in reviews" :key="i">
        <div class="review">
            <h3 class="text-center font-italic isiReview" style="font-weight: 400;">
                {{item.isi}}
            </h3>
            <br>
            <span><h5 class="text-center">{{item.penulis}}</h5></span>
        </div>
    </swiper-slide>
    
    </swiper>
</template>
<script>

/* eslint-disable */

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper/modules';
export default {
    name: 'ReviewCard',
    components:{
      
        Swiper,
        SwiperSlide
    },
    setup(){
        return{
            modules: [Navigation, Pagination, Scrollbar, Autoplay],
        }
        
    },
    data(){
        return{
            reviews:[
                {
                    isi: '"Comfy place to stay, Fair rate!"',
                    penulis:'Agung Nugroho'
                },
                {
                    isi: '"Mewah, aman, nyaman, tenang..great place to stay 🙏"',
                    penulis:'Michel Aaron'
                },
                {
                    isi: '"Tempat tinggal yang nyaman, aman dan lokasi yang strategis"',
                    penulis:'Agus Soelistiono'
                },
                {
                    isi: '"Best airbnb in jogja so far. good location, spacious and clean. very recommended."',
                    penulis:'Tegar'
                },
                {
                    isi: '"Worth every penny that I paid, the place is very clean, spacy living room and bedrooms. The surroundings is also comfortable, very quiet at night, so we traveller can rest really well."',
                    penulis:'Yodivan'
                },
                {
                    isi:'"We felt right at home in Henry’s place, the place is also quiet so we could sleep well. It is very clean so it is comfortable. Living room is spacious enough to have gathering with family. All in all recommended."',
                    penulis:'Lydia'
                }
            ],
            jumlahPage: '',
            page:''
        }
    },
    
   
    created(){
        
    },
    methods:{
        
    }
}
</script>
<style scoped>

.slide{
    height: auto;
    margin: 3rem 0;
    background-color: white;
    
}
.card{
    display: inline-block;
    margin: 0 5rem;
}
.review span{
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
}
</style>