<template>
  <h1>Sonde : {{ id }}</h1>
  <div id="details">
    <form>
      <label><input type="radio" v-model="selectedParameter" value="all"> All</label>
      <label><input type="radio" v-model="selectedParameter" value="temperature"> Température</label>
      <label><input type="radio" v-model="selectedParameter" value="pressure"> Pressure</label>
      <label><input type="radio" v-model="selectedParameter" value="humidity"> Humidité</label>
      <label><input type="radio" v-model="selectedParameter" value="light"> Luminosité</label>
      <label><input type="radio" v-model="selectedParameter" value="wind"> Vent</label>
    </form>

    <Dashboard v-if="selectedParameter === 'all'" :sensorData="sensorData" :id="id"/>
    <Wind v-if="selectedParameter === 'wind'" :selectedParameter="selectedParameter" :id="id"/>
    <OneMeasure v-if="selectedParameter !== 'all' && selectedParameter !== 'wind'"
      :selectedParameter="selectedParameter" :id="id"/>
  </div>

  <div id="MapSonde">
    <LeafletMap />
  </div>
</template>
  
<script>
import Dashboard from '../components/SondeDetails.vue';
import OneMeasure from '../components/OneMeasure.vue'
import LeafletMap from '../components/LeafletMap.vue';
import Wind from '../components/Wind.vue'


export default {
  name: 'App',
  components: {
    Dashboard,
    Wind,
    OneMeasure,
    LeafletMap
  },
  props: {
    id: String
  },
  data() {
    return {
      id: this.id,
      sensorData: {
        temperature: null,
        pressure: null,
        humidity: null,
        light: null,
        wind_direction: null,
        wind_speed: null,
        last_rain: null
      },
      selectedParameter: 'all',

    };
  },
  async created() {
    try {
      const response = await fetch('http://' + this.id + '/live');
      const data = await response.json();
      this.sensorData.temperature = data.measurements.temperature;
      this.sensorData.pressure = data.measurements.pressure;
      this.sensorData.humidity = data.measurements.humidity;
      this.sensorData.light = data.measurements.light;
      this.sensorData.wind_direction = data.measurements.wind.direction;
      this.sensorData.wind_speed = data.measurements.wind.speed;
      this.sensorData.last_rain = (Date.parse(new Date()) - Date.parse(data.measurements.rain))/1000;

    } catch (error) {
      console.error('Erreur lors de la récupération de la température :', error);
    }
  }
};
</script>

<style>
#details {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

#MapSonde {

  position: relative;
  width: 50%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
