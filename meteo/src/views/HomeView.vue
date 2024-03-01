<template>
    <div id="aaa">
        <div class="container">
            <div v-for="(location, index) in locations" :key="index" class="card">
                <a :href="'sondes/' + location.description">
                    <img :src="location.image" alt="Location Image">
                    <div class="card-content">
                        <div class="card-title">{{ location.description }} {{ location.name }}</div>
                        <img :src="location.rain" alt="Rain Image">
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>

<script>

export default {

    data() {
        return {
            locations: [
                {
                    name: 'Londres',
                    description: 'piensg027',
                    image: '/src/components/icons/londres.jpg',
                    rain: '/src/components/icons/soleil.png'
                },
                {
                    name: 'Berlin',
                    description: 'piensg028',
                    image: '/src/components/icons/berlin.jpeg',
                    rain: '/src/components/icons/soleil.png'
                },
                {
                    name: 'San Jose',
                    description: 'piensg030',
                    image: '/src/components/icons/sanjose.jpg',
                    rain: '/src/components/icons/soleil.png'
                },
                {
                    name: 'Tokyo',
                    description: 'piensg031',
                    image: '/src/components/icons/tokyo.jpg',
                    rain: '/src/components/icons/soleil.png'
                },
                {
                    name: 'Sao Paulo',
                    description: 'piensg032',
                    image: '/src/components/icons/saopaulo.jpeg',
                    rain: '/src/components/icons/soleil.png'
                },
            ]
        };
    }
};
</script>
  
<style scoped>
#aaa {
    position: absolute;
    top: 5vh;
    left: 0;

    width: 100vw;
    height: 95vh;
    background-color: gray;

}

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 20px;
}

.container a {
    text-decoration: none;
    color: black;
}

.card {
    width: 30%;
    margin: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    background-color: white;
}

.card img {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;


}

.card-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

}

.card-title {
    font-size: 1.5vw;
}

.card-content img {

    position: relative;
    top: -5px;
    left: 10px;

    max-width: 20%;
    height: auto;
    aspect-ratio: 1/1;

}

@media (min-width: 1000px) {

    .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        margin: 20px;
    }

    .card {
        width: 25%;
    }
}
</style>
