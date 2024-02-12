<template>
  <div class="wind">
    <h2>{{ selectedParameter[0].toUpperCase() + selectedParameter.slice(1) }}</h2>
    <img ref="arrow" src="../components/icons/arrow.png" class="arrow">
    <div v-if="windData">
      <p>Direction du vent: {{ windData.measurements.wind.direction }} °</p>
      <p>Force moyenne du vent: {{ windData.measurements.wind.speed }} Kts</p>
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
    id: String
  },
  data() {
    return {
      windData: null,
    };
  },
  async created() {
    try {
      const response = await fetch('http://' + this.id + '/live');
      const data = await response.json();
      this.windData = data;

      const arrow = this.$refs.arrow;
      arrow.style.rotate = `${data.measurements.wind.direction}deg`;
      // this.$refs.arrow.style.rotate = "90deg";

    } catch (error) {
      console.error('Erreur lors de la récupération des données sur le vent :', error);
    }
  }


};
</script>



  
<style scoped>
.wind {
  margin-top: 20px;
}

.arrow {
  width: 10%;
  height: auto;
}
</style>
  