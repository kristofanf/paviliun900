<template>
   
        <v-row justify="center" align="center" style="background-color: white;">
            <v-col cols="12" lg="8" md="8" xl="8">
                <div >
                    <v-container fluid>
                        <v-btn @click="this.$router.replace({name: 'home'})" elevation="1" color="black">
                            <v-icon
                            start
                            icon="mdi-arrow-left"
                            ></v-icon>
                            back
                        </v-btn>
                        <h1 class="text-start">{{detailUnit.judul}} </h1>
                        <h3 style="font-weight: 500;" class="text-start mb-10">{{detailUnit.tamu}} Guests | {{detailUnit.harga}}</h3>
                        <v-row>
                            <v-col style="height: 40rem;" cols="12" lg="8" md="6" xl="8" v-for="(item,k) in detailUnit.gambar.slice(0,1)" :key="k">
                                <v-img
                                    :src="require(`../assets/airbnb/${item.src}.jpg`)"
                                    cover
                                    height="100%"
                                >
                                </v-img>
                            </v-col>
                            <v-col class="d-flex" style="flex-direction:column; height: 40rem;" >
                                <v-img
                                    class="mb-1 flex-grow-1"
                                    :src="require(`../assets/airbnb/${detailUnit.gambar[1].src}.jpg`)"
                                    height="250"
                                    cover
                                ></v-img>
                                
                                <v-img
                                    class=" flex-grow-1"
                                    :src="require(`../assets/airbnb/${detailUnit.gambar[2].src}.jpg`)"
                                    cover
                                    height="250"
                                    
                                >
                                <v-btn
                                        @click="this.$router.push({name: 'image'})"
                                        fab
                                        small
                                        class="v-btn--example"
                                    >
                                        <p>Show all Photos</p>
                                    </v-btn>
                                </v-img>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
                <div class="appear">
                    <v-row class="ma-10">
                       <v-col>
                            <p class="text-center"> {{detailUnit.detail}}</p>
                       </v-col>
                    </v-row>
                </div>
                <div class="appear">
                    <v-row style="margin-top: 6rem;" justify="center">
                            <h2 class="text-center">Our Facilities</h2>
                    </v-row>
                    <v-row class="ml-1">
                        <v-col v-for="(item,n ) in detailUnit.fasilitas" :key="n" cols="6"  md="4" lg="3" xl="3">
                            <h4 style="font-weight: 400;" ><Icon :icon="item.ikon" :inline="true" width="25" height="25" :style="{ fontSize: '30px' }"/>&emsp;{{item.nama}}</h4>
                        </v-col>
                    </v-row>
                </div>
                <div class="appear">
                    <v-row style="margin-top: 6rem;" justify="center">
                        <h2 class="text-center">House Rules</h2>
                    </v-row>
                    <v-row class="ml-1">
                        <v-col v-for="(item,n ) in detailUnit.rules" :key="n" cols="6"  md="4" lg="3" xl="3">
                            <h4 style="font-weight: 400;" ><Icon :icon="item.ikon" :inline="true" width="25" height="25" :style="{ fontSize: '30px' }"/>&emsp;{{item.aturan}}</h4>
                        </v-col>
                    </v-row>
                </div>    
                <div class="appear">
                    <v-row style="margin-top: 6rem;" justify="center">
                        <h2 class="text-center">How to order</h2>
                    </v-row>
                    <v-row justify="center" align="center">
                        <v-col cols="auto" v-for="order in detailUnit.order" :key="order">
                            <v-btn class="button" style="margin:auto;">
                                <a class="order_button" :href="order.link" target="_blank"><h3><Icon :icon="order.ikon" :inline="true" width="25" height="25" :style="{ fontSize: '30px' }"/> {{order.detail}}</h3></a>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row justify="center" align="center" class="mb-10">
                        <h4 style="font-weight:400;">*Please contact us to check unit availability</h4>
                    </v-row>
                </div>      
            </v-col>
        </v-row>   
</template>

<script>
/* eslint-disable */ 
import { Icon } from '@iconify/vue';
export default {
    name: 'AirbnbDetail',
    components:{
        Icon
    },
    data(){
        return {
            detailUnit:'',
            imageLayout: [
                { cols: 4 },       
            ],
            isMobile: false
       
        }
    },
    created(){
        this.detailUnit = JSON.parse( sessionStorage.getItem('unit'))
    },
    beforeCreate(){
        this.detailUnit = JSON.parse( sessionStorage.getItem('unit'))
        if(this.detailUnit == null){
            this.$router.replace({
                name: 'home',
               
            }).then(()=>{this.$router.go()})

        }
    },   
}
</script>

<style scoped>
    .v-btn--example{
        bottom: 0;
        right: 0;
        position: absolute;
        margin: 0 16px 16px 16px;
        z-index: 99;
    }

    .order_button a{
        text-decoration: none;
        color: black;
    }
    a:visited{
        color: black;
        text-decoration: none;
    }
    a:link{
        color: black;
        text-decoration: none;
    }
    a:hover{
        color: white;
    }
   .button:hover{
        color: white;
        background-color: black;
        transition: ease-in-out 0.4s;
   }
   .appear{
        position: relative;
        transform: translateY(100px);
        opacity: 0;
        transition: 2s all ease;
    }
    .appear.active{
        transform: translateY(0);
        opacity: 1;
    }
</style>