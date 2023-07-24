<template>
    <h1 class="text-center">Our Location</h1>
    <h3 class="text-center alamat">Jl.Kepuh GK III No.900, Gondokusuman, Yogyakarta</h3>
    <br>
    <v-row justify="center">
        
        <v-col cols="12" lg="6" md="6" xl="6">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0900528287575!2d110.38255821101016!3d-7.780276177163063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59a2f2dc8161%3A0x7c1733f14819f16e!2sPaviliun%20900!5e0!3m2!1sen!2sid!4v1688957270598!5m2!1sen!2sid" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </v-col>
        <v-col cols="12" lg="6" md="6" xl="6" class="list">
            
            <ul style="margin-left: 3rem;" class="list-maps">
                <li v-for="(item,i) in list" :key="i" class="item-list"><p>{{item.isi}}</p></li>
            </ul>
        </v-col>
    </v-row>
</template>
<script>
export default {
    name: 'MapsCard',
    data(){
        return{
            list:[
                {
                    isi: '5 minutes driving to Universitas Gajah Mada'
                },
                {
                    isi: '5 minutes driving to Universitas Kristen Duta Wacana'
                },
                {
                    isi: '5 minutes driving to RS Bethesda'
                },
                {
                    isi: '5 minutes driving to RS Panti Rapih'
                },
                {
                    isi: '7 minutes driving to Universitas Sanata Dharma Mrican'
                },
                // {
                //     isi: '8 minuetes driving to SMA Bopkri 1'
                // },
                {
                    isi: '650m to Universitas Negeri Yogyakarta'
                },
                {
                    isi: '650m to Empire XXI'
                },
                {
                    isi: '550m to Superindo Supermarket'
                },
                {
                    isi: '700m to Gardena Department Store'
                },
                {
                    isi: '850m to Galeria Mall'
                },
                {
                    isi: '15 minutes driving to Pakuwon Mall'
                }
            ]
        }
    }
}
</script>
<style scoped>
    .item-list{
        margin: 1rem 0;
        font-weight: 400;
    }
    .list{
        background-color: transparent;
        color: black;
    }
    .alamat{
        background-color: black;
        color: white;
        padding: 0.6rem;
    }
</style>