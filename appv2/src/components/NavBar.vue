<template>
    <nav class="navbar">
        <router-link to="/" class="link">Accueil</router-link>
        <router-link to="/map" class="link">Map</router-link>
    </nav>
</template>
  
<script>
export default {
    name: 'NavBar'
};
</script>
  
<style scoped>
.navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 4vh;

    background-color: #333;
    color: #fff;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    
}

.link {
    margin: 10px;
    color: #fff;
    text-decoration: none;
}

</style>
  