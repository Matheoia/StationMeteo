<template>
    <div class="dashboard">
        <div class="sensor-data">
            <h2>Données de la Sonde</h2>
            <table>
                <tr v-for="(value, parameter) in sensorData" :key="parameter">
                    <td>{{ parameter }}</td>
                    <td>{{ value }}</td>
                    <td>{{ getUnit(parameter) }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'Dashboard',
    props: {
        sensorData: Object,
    },
    data(){
        return {
            units: {
                temperature: '°C',
                pressure: 'hP',
                humidity: '%',
                light: 'Lux',
                wind_direction: '°',
                wind_speed: 'Kts',
                latitude: '°',
                longitude: '°',
                last_rain: 's'
            }
        }
    },
    methods: {
        getUnit(parameter) {
            return this.units[parameter] || '';
        }
    }
};
</script>
  
<style scoped>
.dashboard {
    display: flex;
    justify-content: space-around;
    margin-top: 0px;
}

.sensor-data {
    width: 40%;
}

.temperature-chart {
    width: 40%;
}
</style>