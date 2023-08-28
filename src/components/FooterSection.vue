<template>
    <v-row style="margin-top: 4rem; margin-bottom: 1rem;">
        <v-col>
            <h1 class="text-center">Need a place to stay?</h1>
            <br>
            <h2 class="text-center">Contact us!</h2>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="12" lg="3" md="3" xl="3" v-for="(kontak, i) in kontaks" :key="i">
                <a :href="kontak.link" target="_blank">
                    <h5 class="text-center icons"><Icon :icon="kontak.icon" :inline="true" width="25" height="20" :style="{ fontSize: '20px' }"/>
                        {{kontak.keterangan}}
                    </h5>
                </a> 
        </v-col>
    </v-row>
    <v-row class="mt-10">
        <v-col>
            <h3 class="text-center">Hati-hati penipuan dengan menggunakan foto paviliun 900</h3>
            <h3 class="text-center">Kontak resmi kami hanya yang tertera pada website Paviliun 900</h3>
            <h3 class="text-center">Kami tidak bertanggung jawab atas akun lain yang mengatasnamakan Paviliun 900</h3>
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
                    keterangan: '+62-858-8881-5722',
                    link: 'https://wa.me/6285888815722?text=Halo%20saya%20mau%20info%20lebih%20lanjut%20tentang%20Paviliun900'

                },
                {
                    icon:'mdi-light:email',
                    keterangan: 'paviliun900@gmail.com',
                    link:'mailto:paviliun900@gmail.com?subject=Informasi Paviliun900'
                },
                {
                    icon: 'fa-brands:airbnb',
                    keterangan:' Airbnb Paviliun 900',
                    link: 'https://www.airbnb.com/rooms/41101697'
                },
                {
                    icon: 'cil:building',
                    keterangan: 'Lamudi Paviliun 900',
                    link:'https://www.lamudi.co.id/-agn-34666/'
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