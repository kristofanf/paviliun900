<template>
    <v-carousel hide-delimiters show-arrows="hover" height="300" @change="test">
        <v-carousel-item
            v-for="item in jumlahPage"
            :key="item"
            d-flex
        >
           <v-sheet height="100%" tile>
                <v-row style="height:100%;" align="center" justify="center">
                    <v-col v-for="(i, index) in reviews.slice(page*3-3,page*3)" :key="index" cols="4">
                        <div class="align-center justify-center" style="color:black;">
                            <h2 class="text-center">{{i.isi}}</h2>
                            <br>
                            <h2  class="text-center">{{i.penulis}}</h2>
                        </div>
                    </v-col>
                </v-row>
           </v-sheet>
        </v-carousel-item>
    </v-carousel>
</template>
<script>
export default {
    name: 'ReviewCard',
    data(){
        return{
            reviews:[
                {
                    isi: 'Hai semunya',
                    penulis:'Kirstofan F'
                },
                {
                    isi: 'Hai semunya asikkkka',
                    penulis:'Kirstofan F'
                },
                {
                    isi: 'Hai semunya asikkkkb',
                    penulis:'Kirstofan F'
                },
                {
                    isi: 'Hai semunya asikkkksssc',
                    penulis:'Kirstofan F'
                },
                {
                    isi: 'Hai semunya asikkkksss',
                    penulis:'Kirstofan F'
                },
            ],
            jumlahPage: '',
            page:''
        }
    },
    created(){
        this.getReviews()
        this.page = 1
    },
    methods:{
        getReviews(){
            this.jumlahPage = this.reviews.length/3
            this.jumlahPage = Math.round(this.jumlahPage)
        },
        test(){
            console.log(this.reviews.slice(this.page*3-3,this.page*3).length);
            if(this.reviews.slice(this.page*3-3,this.page*3).length == 0){
                this.page =1
            }else{
                this.page += 1
            }
            
            console.log(this.page);
        }
    }
}
</script>
<style scoped>
.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
color: black;
 -webkit-overflow-scrolling: touch;
 
    
}
.card{
    display: inline-block;
    margin: 0 5rem;
}
</style>