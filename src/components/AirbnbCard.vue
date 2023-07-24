<template>
    <v-row justify="center" style="margin-bottom: 1rem;">
        <v-col class="unit-card" cols="12" lg="4" md="4" xl="4" v-for="(unit, i) in deskripsi" :key="i" style="margin: 0 1rem;" >
        
            <v-col >
                <v-carousel
                    hide-delimiter-background
                    cycle
                    show-arrows="hover"
                >
                    <v-carousel-item
                    v-for="(item,k) in deskripsi[i].gambar.slice(0,5)"
                    :key="k"
                    :src="require(`../assets/airbnb/${item.src}.jpg`)"
                    cover
                    >
                    <v-container
                        fill-height
                        fluid
                        pa-0 ma-0 pb-3 
                                
                    >
                        <v-layout fill-heigt pb-4 mb-4>
                                <v-card :color="deskripsi[i].tag == 'Available' ? 'white': '#777b7e'" class="pa-2">
                                    <span class="black--text text-body-1">{{deskripsi[i].tag}}</span>
                                </v-card>
                        </v-layout>
                    </v-container>
                    </v-carousel-item>
                </v-carousel>
                <br>
                <div @click="sendData(deskripsi[i])">
                    <p style="font-weight:700;" v-html="deskripsi[i].fitur"></p>
                    <br>
                    <h2 style="font-weight:500;">{{deskripsi[i].judul}}</h2>
                    <hr style="width: 50%; font-weight: 600;">
                    <br>
                    <div class="isi" style="display:block; oaverflow:auto;">
                        <p class="deskripsi" style="">{{deskripsi[i].desc}}</p>
                        <br>
                        <span><h3 class="" style="color:#5c5c5c; ">{{deskripsi[i].harga}}</h3></span>
                    </div>
                </div>
            </v-col>
        </v-col>
    </v-row>
</template>

<script>
//import { Icon } from '@iconify/vue';
//import router from '../router/index.js'
export default {
    name: 'AirbnbCard',
    components:{
       
    },
    created(){
        this.sortedArray();
    },
    data(){
        return{
            deskripsi:[
                {
                    id: 1,
                    judul: 'Spacious and Comfortable Airbnb',
                    fitur: '4 bedrooms &emsp; 8 guests &emsp; 2 bathrooms &emsp; free Wi-Fi',
                    desc: 'Paviliun 900 airbnb location is in the center of Jogja so there are many places you can visit. Paviliun 900 airbnb has 4 bedrooms, 2 bathrooms, kitchen, and one big livingroom for you to enjoy your time with your family',
                    harga: 'Rp.950.000/night',
                    tamu: '8',
                    tag:'Available',
                    detail: 'Our Airbnb located in quiet and green area near UGM and UNY campuses. The master bedroom is very spacious with ensuite bathroom. The other 3 bedrooms can accommodate up to 6 people with comfort. Bedrooms are well lit and provided with working desk to support WFH. The living and dining areas are spacious, cozy, suitable for small gatherings. The kitchen provides a gas stove, microwave, and a big refrigerator.',
                    gambar:[
                        {
                            src: 'airbnbTengah'
                        },
                        {
                            src: 'dapur'
                        },
                        {
                            src: 'master'
                        },
                        {
                            src: 'tengah'
                        },
                        {
                            src: 'master2'
                        },
                        {
                            src: 'hall'
                        },
                        {
                            src: 'kamar2'
                        },
                        {
                            src: 'kamar3'
                        },
                        {
                            src: 'kamar4'
                        },
                        {
                            src: 'km1'
                        },
                         {
                            src: 'dapur1'
                        },
                        
                    ],
                    fasilitas:[
                        {
                            nama: '4 Bedrooms',
                            ikon: 'mdi:bed-outline'
                        },
                        {
                            nama: '2 Bathrooms',
                            ikon: 'teenyicons:bath-outline'
                        },
                        {
                            nama: 'Smart TV 55"',
                            ikon: 'pixelarticons:device-tv-smart'
                        },
                        {
                            nama: 'Kitchen',
                            ikon: 'fa6-solid:kitchen-set'
                        },
                        {
                            nama: 'Wifi',
                            ikon: 'iconoir:wifi'
                        },
                        {
                            nama: 'Air Conditioning',
                            ikon: 'tabler:air-conditioning'
                        },
                        {
                            nama: 'Free Washer',
                            ikon: 'fluent:washer-24-regular'
                        },
                        {
                            nama: 'Free Parking (2 Cars)',
                            ikon: 'ph:car'
                        },
                        {
                            nama: 'Water Heater',
                            ikon: 'material-symbols:water-heater-outline'
                        },
                        {
                            nama: 'Refrigerator',
                            ikon: 'ep:refrigerator'
                        },
                        {
                            nama: 'Microwave',
                            ikon: 'material-symbols:microwave-outline'
                        },
                    ],
                    rules: [
                        {
                            aturan: 'No Smoking',
                            ikon: 'mdi:no-smoking'
                        },
                        {
                            aturan: 'Check-in: 2:00 PM - 7:00PM',
                            ikon: 'icon-park-outline:check-in'
                        },
                        {
                            aturan: 'Checkout before 12:00PM',
                            ikon: 'ri:time-line'
                        },
                        {
                            aturan: '8 guests maximum ',
                            ikon: 'fluent:people-20-regular'
                        },
                        
                    ],
                    order:[
                        {
                            detail: 'Whatsapp',
                            link: 'https://wa.me/6281270853749?text=Halo%20saya%20mau%20pesan%20airbnb%20Paviliun900',
                            ikon: 'la:whatsapp'
                        },
                        {
                            detail: 'Airbnb',
                            link: 'https://www.airbnb.com/rooms/41101697',
                            ikon: 'fa-brands:airbnb'
                        },
                    ]
                },
                {
                    id: 2,
                    judul: 'Exclusive and Strategic Apartment',
                    fitur: '3 bedrooms &emsp; 6 guests &emsp; 2 bathrooms',
                    desc: 'Exclusive 3 bedrooms unit apartment in the center of Jogja that fully furnished. This unit is for you that need a place for long term stay in Jogja and live comfortably',
                    harga: 'Rp.50.000.000/year',
                    tag: 'Not Available',
                    gambar:[
                        {
                            src: 'b21-LivingRoom'
                        },
                        {
                            src: 'b21-dapur'
                        },
                        {
                            src: 'b21-masterBed'
                        },
                        {
                            src: 'b21-KMM'
                        },
                        {
                            src: 'b21-Koridor'
                        },
                    ],
                    fasilitas:[
                        {
                            nama: '3 Bedrooms',
                            ikon: 'mdi:bed-outline'
                        },
                        {
                            nama: '2 Bathrooms',
                            ikon: 'teenyicons:bath-outline'
                        },
                        {
                            nama: 'Smart TV 32"',
                            ikon: 'pixelarticons:device-tv-smart'
                        },
                        {
                            nama: 'Kitchen',
                            ikon: 'fa6-solid:kitchen-set'
                        },
                        {
                            nama: 'Wifi**',
                            ikon: 'iconoir:wifi'
                        },
                        {
                            nama: 'Air Conditioning',
                            ikon: 'tabler:air-conditioning'
                        },
                        {
                            nama: 'Washer',
                            ikon: 'fluent:washer-24-regular'
                        },
                        {
                            nama: 'Free Parking (1 Cars)',
                            ikon: 'ph:car'
                        },
                        {
                            nama: 'Water Heater',
                            ikon: 'material-symbols:water-heater-outline'
                        },
                        {
                            nama: 'Refrigerator',
                            ikon: 'ep:refrigerator'
                        },
                        {
                            nama: 'Microwave',
                            ikon: 'material-symbols:microwave-outline'
                        },
                    ],
                    rules: [
                        {
                            aturan: 'No Smoking',
                            ikon: 'mdi:no-smoking'
                        },
                       
                        {
                            aturan: '6 guests maximum ',
                            ikon: 'fluent:people-20-regular'
                        },
                        
                    ],
                    order:[
                        {
                            detail: 'Whatsapp',
                            link: 'https://wa.me/6281270853749?text=Halo%20saya%20mau%20pesan%20airbnb%20Paviliun900',
                            ikon: 'la:whatsapp'
                        },
                        // {
                        //     detail: 'Airbnb',
                        //     link: 'https://www.airbnb.com/rooms/41101697',
                        //     ikon: 'fa-brands:airbnb'
                        // },
                    ]
                    
                },
                // {
                //     judul: 'Low Cost Exclusive Airbnb',
                //     fitur: '2 bedrooms &emsp; 4 guests &emsp; 2 bathrooms',
                //     desc: '2 bedrooms airbnb with competitive price. A simple yet fully furnished airbnb for your staycation and it is in the center of Yogyakarta city',
                //     harga: 'Rp.550.000/night',
                //     tag: 'Not Available',
                //     gambar:[
                //         {
                //             src: 'b21-LivingRoom'
                //         },
                //         {
                //             src: 'b21-dapur'
                //         },
                //         {
                //             src: 'b21-masterBed'
                //         },
                //         {
                //             src: 'b21-KMM'
                //         },
                //         {
                //             src: 'b21-Koridor'
                //         },
                //     ]
                // },
                // {
                //     judul: 'Minimalist and Compact Apartment',
                //     fitur: '2 bedrooms &emsp; 3 guests &emsp; 2 bathrooms',
                //     desc: 'This unit has 2 bedrooms, 2 bathrooms, kitchen set, and livingroom. This unit is fully furnished and it is suitable for you that looking for a nice and compact apartment unit with reasonable price',
                //     harga: 'Rp.40.000.000/year',
                //     tag: 'Not Available',
                //     gambar:[
                //         {
                //             src: 'b21-LivingRoom'
                //         },
                //         {
                //             src: 'b21-dapur'
                //         },
                //         {
                //             src: 'b21-masterBed'
                //         },
                //         {
                //             src: 'b21-KMM'
                //         },
                //         {
                //             src: 'b21-Koridor'
                //         },
                //     ]
                // },
               
                
                
            ],
            
            gambar: [
                {
                    src: 'airbnbTengah'
                },
                {
                    src: 'dapur'
                },
                {
                    src: 'masterbr'
                },
                {
                    src: 'tengah'
                },
            ],
            fasilitas:[
                {
                    icon: 'mdi:person-outline',
                    jumlah: '8'
                },
                {
                    icon: "mdi:bed-outline",
                    jumlah: '4'
                },
                {
                    icon: 'lucide:bath',
                    jumlah: '2'
                },
                {
                    icon: 'material-symbols:wifi',
                    jumlah: '100Mbps'
                }
            ],
            item: []
        }
    },
    methods:{
        sortedArray(){
            this.deskripsi.sort((a,b)=>{
                const tagA = a.tag.toUpperCase()
                const tagB = b.tag.toUpperCase()
                if(tagA< tagB){
                    return -1;
                }
                if(tagA > tagB){
                    return 1;
                }
                return 0
            })
            
        },
        sendData(item){
            this.item = item
            sessionStorage.setItem("unit",JSON.stringify(this.item))
            this.$router.push({
                name: 'detail',
            })
            
        }
    }
}
</script>
<style scoped>
 .button-order-wa{
   
    transition: ease-out 0.5s;
    color: #25D366;
    box-shadow: inset 0 0 0 0 #25D366;
 } 
  .button-order-wa:hover{
    
     color: white;
     box-shadow: inset 500px 0 #25D366;
  }
  .button-order-wa:active{
    
   transform: scale(0.9);
  }
.button-order-airbnb{
    box-shadow: inset 0 0 0 0 #FF5A5F;
    transition: ease-out 0.5s;
    color: #FF5A5F;
 }

 .button-order-airbnb:hover{
    box-shadow: inset 500px 0 #FF5A5F;
    color: white;
   
 }
 .button-order-airbnb-mobile{
    background-color: #FF5A5F;
    color: white;
 }
 .button-order-wa-mobile{
    background-color: #25D366;
    color: white;
 }
 .isi span{
   
    position: absolute;
   
   
 } 
 .isi{
     margin-bottom: 3rem;
 }
 .unit-card{
    transition: ease-out 0.5s;
 }
 .unit-card:hover{
   
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px
 }
 /* .deskripsi{
    height: 80px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; 
    -webkit-box-orient: vertical;
 } */
 /* @media only screen and (max-width:960px)  {
    .deskripsi{
        height: 70px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3; 
        -webkit-box-orient: vertical;
    }
 } */
</style>