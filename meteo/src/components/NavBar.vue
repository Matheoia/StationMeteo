<!-- 
    La barre de navigation entre les pages. 
 -->


<template>
    <nav class="navbar">
        <router-link to="/" class="link">Accueil</router-link>
        <router-link to="/map" class="link">Carte</router-link>
        <div class="search-container">
            <input type="text" v-model="searchTerm" @keyup.enter="navigateToSonde" placeholder="Rechercher..."
                class="search-input">
            <button @click="navigateToSonde" class="search-button">Rechercher</button>
        </div>
    </nav>
</template>
  
<script>
export default {
    name: 'NavBar',
    data() {
        return {
            searchTerm: ''
        };
    },
    methods: {
        navigateToSonde() {
            this.$router.push({ path: '/sondes/' + this.searchTerm });
        }
    }
};
</script>
  
<style scoped>
.navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 5vh;

    background-color: #333;
    color: #fff;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

}

.link {
    margin: 0 20px;
    font-size: 1.5vw;

    font-family: system-ui;
    color: #fff;
    text-decoration: none;
}

.search-container {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    align-items: center;
}

.search-input {
    padding: 5px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
}

.search-button {
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    background-color: #555;
    color: #fff;
    cursor: pointer;
}

@media (max-width: 800px) {
    .link {
        font-size: 3vw;
    }
}
</style>
