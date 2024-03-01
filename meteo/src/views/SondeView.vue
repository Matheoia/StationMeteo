<template>
  <div id="aaa">
    <h1>{{ locationName }}</h1>
    <form id="formRadio">
      <label><input type="radio" v-model="selectedParameter" value="all"> All</label>
      <label><input type="radio" v-model="selectedParameter" value="temperature"> Température</label>
      <label><input type="radio" v-model="selectedParameter" value="pressure"> Pressure</label>
      <label><input type="radio" v-model="selectedParameter" value="humidity"> Humidité</label>
      <label><input type="radio" v-model="selectedParameter" value="light"> Luminosité</label>
      <label><input type="radio" v-model="selectedParameter" value="wind"> Vent</label>
    </form>
    <div id="details">
      <Dashboard v-if="selectedParameter === 'all'" :sensorData="sensorData" :id="id" />
      <OneMeasure v-if="selectedParameter !== 'all'" :selectedParameter="selectedParameter" :id="id" />
    </div>

    <div>
      <LeafletMap id="MapSonde" />
    </div>
  </div>
</template>
  
<script>
import Dashboard from '../components/SondeDetails.vue';
import OneMeasure from '../components/OneMeasure.vue'
import LeafletMap from '../components/LeafletMap.vue';


export default {
  name: 'App',
  components: {
    Dashboard,
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
      locations: [
        {
          name: 'Londres',
          description: 'piensg027'
        },
        {
          name: 'Berlin',
          description: 'piensg028'
        },
        {
          name: 'San Jose',
          description: 'piensg030'
        },
        {
          name: 'Tokyo',
          description: 'piensg031'
        },
        {
          name: 'Sao Paulo',
          description: 'piensg032'
        },
      ]
    };
  },
  computed: {
    locationName() {
      const location = this.locations.find(loc => loc.description === this.id);
      return location ? location.name : '';
    }
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
      this.sensorData.last_rain = (Date.parse(new Date()) - Date.parse(data.measurements.rain)) / 1000;

    } catch (error) {
      console.error('Erreur lors de la récupération de la température :', error);
    }
  }
};
</script>

<style>
#aaa {
  position: absolute;
  top: 5vh;
  left: 0;

  color: white;

  width: 100vw;
  height: 95vh;
  background-color: gray;

}

#formRadio {
  margin-top: -10px;
}

#details {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  position: absolute;

  top: 50%;
  left: 25%;

  width: 40%;
  height: 50vh;

  transform: translate(-50%, -50%);

}

#MapSonde {

  position: absolute;

  top: 50%;
  left: 75%;

  width: 40%;
  height: 50vh;

  transform: translate(-50%, -50%);
}
</style>
