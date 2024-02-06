<template>
  <div>SONDE :</div>
  <div id="details">
    <form>
      <label><input type="radio" v-model="selectedParameter" value="all"> All</label>
      <label><input type="radio" v-model="selectedParameter" value="temperature"> Température</label>
      <label><input type="radio" v-model="selectedParameter" value="pressure"> Pressure</label>
      <label><input type="radio" v-model="selectedParameter" value="humidity"> Humidité</label>
      <label><input type="radio" v-model="selectedParameter" value="luminosity"> Luminosité</label>
      <label><input type="radio" v-model="selectedParameter" value="wind"> Vent</label>
    </form>
    
    <Dashboard v-if="selectedParameter === 'all'" :sensorData="sensorData" />
    <Wind v-if="selectedParameter === 'wind'" :selectedParameter="selectedParameter" />
    <OneMeasure v-if="selectedParameter !== 'all' && selectedParameter !== 'wind'" :selectedParameter="selectedParameter"/>
  </div>

  <div id="MapSonde">
    <LeafletMap  />
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
  data() {
    return {
      sensorData: {
        temperature: null,
        pressure: null,
        humidity: null,
        luminosity: null,
        wind_heading: null,
        wind_speed_avg: null,
        wind_speed_max: null,
        wind_speed_min: null,
        latitude: null,
        longitude: null, 
        last_rain: null
      },
      selectedParameter: 'all',
      
    };
  }, 
  async created() {
    try {
      const response = await fetch('http://localhost:3000/live');
      const data = await response.json();
      this.sensorData.temperature = data.temperature.value;
      this.sensorData.pressure = data.pressure.value;
      this.sensorData.humidity = data.humidity.value;
      this.sensorData.luminosity = data.luminosity.value;
      this.sensorData.wind_heading = data.wind_heading.value;
      this.sensorData.wind_speed_avg = data.wind_speed_avg.value;
      this.sensorData.wind_speed_max = data.wind_speed_max.value;
      this.sensorData.wind_speed_min = data.wind_speed_min.value;
      this.sensorData.latitude = data.gps.latitude;
      this.sensorData.longitude = data.gps.longitude;
      this.sensorData.last_rain = data.rain;
      
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

#MapSonde{
  
  position: relative;
  width: 50%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
