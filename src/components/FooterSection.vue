<template>
    <v-row style="margin-top: 4rem; margin-bottom: 1rem;">
        <v-col>
            <h1 class="text-center">Need a place to stay?</h1>
            <br>
            <h2 class="text-center">Contact us!</h2>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" lg="4" md="4" xl="4" v-for="(kontak, i) in kontaks" :key="i">
            <v-button class="button-kontak">
                <a :href="kontak.link" target="_blank"><h5 class="text-center icons"><Icon :icon="kontak.icon" :inline="true" width="25" height="20" :style="{ fontSize: '20px' }"/>{{kontak.keterangan}}</h5></a> 
            </v-button>
        </v-col>
    </v-row>
</template>
<script>
import { Icon } from '@iconify/vue';
export default {
    name: 'FooterSection',
    components:{
        Icon
    },
    data(){
        return{
            kontaks:[
                {
                    icon: 'la:whatsapp',
                    keterangan: '+62-812-7085-3749',
                    link: 'https://wa.me/6281270853749?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900'

                },
                {
                    icon:'mdi-light:email',
                    keterangan: 'paviliun900@gmail.com',
                    link:'www.gmail.com'
                },
                {
                    icon: 'fa-brands:airbnb',
                    keterangan:'Paviliun 900 Airbnb',
                    link: 'https://www.airbnb.com/rooms/41101697'
                }
            ]   
        }
    }

}
</script>
<style scoped>
    .icons{
        font-size: 1.2rem;
        font-weight: 400;
    }
    Icon{
        margin-top: 1rem;
    }
    a:link{
        color: black;
        text-decoration: none;
    }
    a:visited{
        color: black;
        text-decoration: none;
    }
  
</style>