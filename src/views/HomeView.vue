<template>
  <span>
     <home-hero></home-hero>
      <home-details></home-details>
  </span>
 
</template>

<script>
import { defineComponent } from 'vue';

// Components
import HomeHero from '../components/HomeHero.vue';
import HomeDetails from '../components/HomeDetails.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    HomeHero,
    HomeDetails
  },
  created(){
    sessionStorage.clear()
  }
});
</script>
