<template>
    <v-row justify="center" >
        <v-col cols="12" lg="8" md="8" xl="8">
          {{detailUnit.judul}}
            <h2>HAIIII</h2>
        </v-col>
    </v-row>
</template>

<script>
/* eslint-disable */ 
export default {
    name: 'AirbnbDetail',
    data(){
        return {
            detailUnit:''
        }
    },
    
    created(){
    this.detailUnit = JSON.parse( sessionStorage.getItem('unit'))
      console.log(this.detailUnit.judul);
    },
    
}
</script>