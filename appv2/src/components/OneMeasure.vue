<template>
    <div class="measurement">
        <h2>{{ selectedParameter[0].toUpperCase() + selectedParameter.slice(1) }}</h2>
        <p>actuellement : {{ measurement }} {{ getUnit(selectedParameter) }}</p>
    </div>
</template>
  
<script>



export default {
    name: 'OneMeasure',
    props: {
        selectedParameter: String,
        measurement: String
    },
    data() {
        return {
            measurement: null,
            units: {
                temperature: '°C',
                pressure: 'hP',
                humidity: '%',
                luminosity: 'Lux',
                wind_heading: '°',
                wind_speed_avg: 'Kts',
                wind_speed_max: 'Kts',
                wind_speed_min: 'Kts'
            }
        };
    }, 
    created() {
        this.fetchData();
    },
    watch: {
        selectedParameter(newVal, oldVal) {
            this.fetchData();
        }
    },

    methods: {
        async fetchData() {
            try {
                const response = await fetch(`http://localhost:3000/live/measure/${this.selectedParameter}`);
                const data = await response.json();
                this.measurement = data.measure;

            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        },
        getUnit(parameter) {
            return this.units[parameter] || ''; 
        }
    }
};
</script>
  
<style scoped>
.measurement {
    margin-top: 0px;
}
</style>