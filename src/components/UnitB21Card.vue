<template>
    <v-card>
        <v-flex xs6>
            <v-carousel>
           <v-carousel-item
            v-for="(item,i) in gambar"
            :key="i"
            :src="require(`../assets/UnitB21/${item.src}.jpg`)"
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
                          <span class="black--text text-body-1">Only Rp.50.000.000/Year</span>
                          </v-card>
                        </v-flex>
                      </v-layout>
            </v-container>
            </v-carousel-item>
            
        </v-carousel>
        </v-flex>
        
        <v-card-actions class="justify-center">
            <v-row>
                <v-col>
                    <h2 class="text-h5">Exclusive and Comfortable Apartment</h2>
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
        </v-card-actions>
        <v-card-actions>
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
        
        </v-card-actions>
        </v-card>
</template>

<script>
import { Icon } from '@iconify/vue';
export default {
    name: 'UnitB21Card',
    components:{
        Icon,
    },
    data(){
        return{
       
            gambar: [
                {
                    src: 'LivingRoom'
                },
                {
                    src: 'dapur'
                },
                {
                    src: 'masterBed'
                },
                {
                    src: 'KMM'
                },
                {
                    src: 'Koridor'
                },
            ],
            fasilitas:[
                {
                    icon: 'mdi:person-outline',
                    jumlah: '6'
                },
                {
                    icon: "mdi:bed-outline",
                    jumlah: '3'
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
</style>