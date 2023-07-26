<template>
    <v-row justify="center" align="center" style="background-color:white;">
        <v-col cols="12" lg="8" md="8" xl="8">
            <v-container>
                <v-btn @click="this.$router.replace({name: 'detail'})" class="mb-3" elevation="1" color="black">
                    <v-icon
                    start
                    icon="mdi-arrow-left"
                    ></v-icon>
                        back
                </v-btn>
                <v-row>
                    <v-col
                        v-for="(item,k) in detailUnit.gambar" :key="k"
                    
                        class="d-flex child-flex"
                        cols="12"
                        sm="4"
                        lg="4"
                        ms="4"
                        xl="4"
                    >
                        <v-img
                            :src="require(`../assets/airbnb/${item.src}.jpg`)"
                            :lazy-src="require(`../assets/airbnb/${item.src}.jpg`)"
                            aspect-ratio="1"
                            cover
                            class="bg-grey-lighten-2 gallery"
                            @click="showImage(item.src)"
                            
                        >
                        </v-img>
                        <div v-if="dataImage" class="overlay">
                            
                            <v-img 
                                class="mt-10 mb-5"
                                :src="dataImage"
                                height="95vh"
                                contain
                                dark
                                aspect-ratio="1"
                            @click.stop="dataImage = null"
                            ><v-btn @click="dataImage = null" class="ma-5" style="float:right;">close</v-btn></v-img>
                            
                        </div>
                            <template v-slot:placeholder>
                                <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                >
                                    <v-progress-circular
                                    indeterminate
                                    color="grey-lighten-5"
                                    ></v-progress-circular>
                                </v-row>
                            </template>   
                        
                    </v-col>
                </v-row>
            </v-container>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'ImageGallery',
    beforeCreate(){
        this.detailUnit = JSON.parse( sessionStorage.getItem('unit'))
        if(this.detailUnit == null){
            this.$router.replace({
                name: 'home',
               
            }).then(()=>{this.$router.go()})

        }
    },
    created() {
        this.detailUnit = JSON.parse( sessionStorage.getItem('unit'))
    },
    data(){
        return {
            dataImage: null
        }
    },
    methods: {
        showImage(data) {
          this.dataImage = require('../assets/airbnb/'+data+'.jpg')
        },
        hideImage() {
         
          this.dataImage = null
          // Enable scrolling
        }
      }
}
</script>

<style scoped>
.overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}
.gallery{
    transition: ease-out 0.5s
}
.gallery:hover{
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px

}
</style>