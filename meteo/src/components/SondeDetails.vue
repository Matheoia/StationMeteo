<template>
    <div class="dashboard">
        <table>
            <tr v-for="(value, parameter) in sensorData" :key="parameter">
                <td>{{ parameter }}</td>
                <td>{{ value }}</td>
                <td>{{ getUnit(parameter) }}</td>
            </tr>
        </table>
    </div>
</template>
  
<script>

export default {
    name: 'Dashboard',
    props: {
        sensorData: Object,
    },
    data() {
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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 0px;
}
</style>