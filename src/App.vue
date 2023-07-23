<template>
    <v-app>
        <v-main transition="slide-x-transition" style="background-color: #F5F5F5">
            <router-view></router-view>
            <float-button></float-button>
            <footer-section></footer-section>
        </v-main>
    </v-app>
</template>

<script>
import FooterSection from '../src/components/FooterSection.vue'
import FloatButton from '../src/components/FloatButton.vue'
export default {
    name: 'App',
    components:{
        FooterSection,
        FloatButton
    }
};
</script>

<style>
</style>