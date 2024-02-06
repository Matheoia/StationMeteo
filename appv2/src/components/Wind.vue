<template>
    <div class="wind">
      <h2>{{ selectedParameter[0].toUpperCase() + selectedParameter.slice(1) }}</h2>
      <div v-if="windData">
        <p>Direction du vent: {{ windData.wind_heading.value }} °</p>
        <p>Force moyenne du vent: {{ windData.wind_speed_avg.value }} Kts</p>
        <p>Force maxi du vent: {{ windData.wind_speed_max.value }} Kts</p>
        <p>Force minimale du vent: {{ windData.wind_speed_min.value }} Kts</p>
        
      </div>
      <div v-else>
        <p>Aucune donnée sur le vent disponible.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Wind',
    props: {
      selectedParameter: String,
    },
    data() {
      return {
        windData: null,
      };
    },
    async created() {
      try {
        const response = await fetch('http://localhost:3000/live/wind');
        const data = await response.json();
        this.windData = data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données sur le vent :', error);
      }
    },
  };
  </script>
  
  <style scoped>
  .wind {
    margin-top: 20px;
  }
  </style>
  