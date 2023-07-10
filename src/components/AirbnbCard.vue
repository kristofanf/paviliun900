<template>
    <v-row justify="center">
        <v-col cols="12" lg="4" md="4" xl="4" v-for="(unit, i) in deskripsi" :key="i" style="margin: 0 1rem;">
        
            <v-flex xs6>
                <v-carousel
                    hide-delimiter-background
                    cycle
                    show-arrows="hover"
                >
                    <v-carousel-item
                    v-for="(item,k) in deskripsi[i].gambar"
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
                                <v-flex xs12>
                                    <v-card color="white" class="pa-2">
                                    <span class="black--text text-body-1">{{deskripsi[i].tag}}</span>
                                    </v-card>
                                </v-flex>
                                </v-layout>
                    </v-container>
                    </v-carousel-item>
                </v-carousel>
                <br>
                <p style="font-weight:700;" v-html="deskripsi[i].fitur"></p>
                <br>
                <h2 style="font-weight:500;">{{deskripsi[i].judul}}</h2>
                <hr style="width: 50%; font-weight: 600;">
                <br>
                <p class="deskripsi" style="">{{deskripsi[i].desc}}</p>
                <br>
                <h3 style="color:#5c5c5c; margin-bottom: 3rem;">{{deskripsi[i].harga}}</h3>
            </v-flex>
        </v-col>
    </v-row>
    
        
        <!-- <v-card-actions class="justify-center">
            <v-row>
                <v-col>
                    <h2 class="text-h5">Spacious and Comfortable Airbnb</h2>
                </v-col>
                <v-col>
                     <div class="d-flex justify-center">
                       
                        <div class="d-flex" v-for="(item,i) in fasilitas" :key="i">
                            <Icon :style="{ fontSize: '24px', }" :icon="item.icon" />
                            <p class="font-weight-medium" style="font-family: roboto; font-size: 1.2rem;">&nbsp;{{item.jumlah}}</p>
                            &emsp;
                        </div>
                        
                    </div>
                </v-col>
            </v-row>
        </v-card-actions> -->
        <!-- <v-card-actions>
            <v-row class="hidden-sm-and-down">
                <v-col>
                    <v-btn class="button-order-airbnb" block href="https://www.airbnb.com/rooms/41101697" target="_blank">
                        <Icon :style="{ fontSize: '25px' }" icon="mingcute:airbnb-line" />
                        <p class="text-body-1">Order via Airbnb</p>
                    </v-btn>
                </v-col>
                
                <v-col>
                    <v-btn class="button-order-wa" block>
                        <Icon :style="{ fontSize: '25px' }" icon="basil:whatsapp-outline" />
                        <p class="text-body-1">Order via Whatsapp</p>
                    </v-btn>
                </v-col>
            </v-row>
            <v-row class="hidden-md-and-up">
                <v-col>
                    <v-btn class="button-order-airbnb-mobile" block href="https://www.airbnb.com/rooms/41101697" target="_blank">
                        <Icon :style="{ fontSize: '25px' }" icon="mingcute:airbnb-line" />
                        <p class="text-body-1">Order via Airbnb</p>
                    </v-btn>
                </v-col>
                
                <v-col>
                    <v-btn class="button-order-wa-mobile" block>
                        <Icon :style="{ fontSize: '25px' }" icon="basil:whatsapp-outline" />
                        <p class="text-body-1">Order via Whatsapp</p>
                    </v-btn>
                </v-col>
            </v-row>
        
        </v-card-actions> -->
       
</template>

<script>
//import { Icon } from '@iconify/vue';
export default {
    name: 'AirbnbCard',
    components:{
       
    },
    data(){
        return{
            deskripsi:[
                {
                    judul: 'Spacious and Comfortable Airbnb',
                    fitur: '4 bedrooms &emsp; 8 guests &emsp; 2 bathrooms &emsp; free Wi-Fi',
                    desc: 'Paviliun 900 airbnb location is in the center of Jogja so there are many places you can visit. Paviliun 900 airbnb has 4 bedrooms, 2 bathrooms, kitchen, and one big livingroom for you to enjoy your time with your family',
                    harga: 'Rp.950.000/night',
                    tag:'Superhost',
                    gambar:[
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
                    ]
                },
                {
                    judul: 'Exclusive and Strategic Apartment',
                    fitur: '3 bedrooms &emsp; 6 guests &emsp; 2 bathrooms',
                    desc: 'Paviliun 900 airbnb has 4 bedrooms, 2 bathrooms, kitchen, and one big livingroom for you to enjoy your time with your family',
                    harga: 'Rp.50.000.000/year',
                    tag: 'Rare to Find',
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
                    ]
                },
                {
                    judul: 'Exclusive and Strategic Apartment',
                    fitur: '3 bedrooms &emsp; 6 guests &emsp; 2 bathrooms',
                    desc: 'Paviliun 900 airbnb has 4 bedrooms, 2 bathrooms, kitchen, and one big livingroom for you to enjoy your time with your famil',
                    harga: 'Rp.50.000.000/year',
                    tag: 'Rare to Find',
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
                    ]
                },
                {
                    judul: 'Exclusive and Strategic Apartment',
                    fitur: '3 bedrooms &emsp; 6 guests &emsp; 2 bathrooms',
                    desc: 'Paviliun 900 airbnb has 4 bedrooms, 2 bathrooms, kitchen, and one big livingroom for you to enjoy your time with your famil',
                    harga: 'Rp.50.000.000/year',
                    tag: 'Rare to Find',
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
                    ]
                },
               
                
                
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
            ]
        }
    },
    methods:{
        
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
 .deskripsi{
    height: 80px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */  
    -webkit-box-orient: vertical;
 }
 @media only screen and (max-width:960px)  {
    .deskripsi{
        height: 70px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3; /* number of lines to show */  
        -webkit-box-orient: vertical;
    }
 }
</style>