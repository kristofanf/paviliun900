<template>
    <v-parallax id="cover"
    src="../assets/cover.jpg"
    >
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="mb-4" style="">
                Welcome to Paviliun 900
            </h1>
            <h4 class="subheading ">
                The Unique Paviliun in The Heart of Yogyakarta City
            </h4>
        </div>
    </v-parallax>
</template>

<script>
export default {
    name: 'HomeHero'
};
</script>

<style scoped>
    .v-responsive__content{
         background: linear-gradient(45deg, black, transparent);
    }
    h1{
        font-size: 4rem;
        font-weight: 500;
    }
    h4{
            background-color: black; 
            padding: 0.5rem; 
            border-radius: 2rem; 
            font-weight: 200;
    }
    @media only screen and (max-width:960px) {
        h1 {
            font-size: 2rem;
        }
        h4 {
            font-size: 0.8rem;
        }
    }
</style>