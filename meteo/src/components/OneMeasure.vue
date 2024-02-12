<template>
    <div class="measurement">
        <h2>{{ selectedParameter[0].toUpperCase() + selectedParameter.slice(1) }}</h2>
        <p>Actuellement : {{ measurement }} {{ getUnit(selectedParameter) }}</p>
        <div class="chart-container">
            <canvas ref="chart"></canvas>
        </div>
        <div class="button-container">
            <button @click="changePeriod('year')">Année</button>
            <button @click="changePeriod('month')">Mois</button>
            <button @click="changePeriod('week')">Semaine</button>
            <button @click="changePeriod('day')">Jour</button>
            <button @click="changePeriod('hour')">Heure</button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

export default {
    name: 'OneMeasure',
    props: {
        id: String,
        selectedParameter: String,
        measurement: String
    },
    setup(props) {

        const chart = ref(null);
        const units = {
            temperature: '°C',
            pressure: 'hP',
            humidity: '%',
            light: 'Lux',
            wind_direction: '°',
            wind_speed: 'Kts',
        };

        const drawChart = (labels, data) => {

            if (chart.value && chart.value.chart) {
                chart.value.chart.destroy();
            }

            const ctx = chart.value.getContext('2d');
            chart.value.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `${props.selectedParameter} (${units[props.selectedParameter]})`,
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        };

        const displayData = (period) => {
            let labels = [];
            let data = [];

            switch (period) {
                case 'year':
                    labels = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
                    data = [20, 21, 22, 23, 24, 25, 26, 27, 26, 25, 24, 23];
                    break;
                case 'month':
                    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    data = [15, 17, 16, 18];
                    break;
                case 'week':
                    labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    data = [10, 12, 11, 13, 14, 15, 16];
                    break;
                case 'day':
                    labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
                    data = [18, 19, 20, 21, 22, 23, 24, 23];
                    break;
                case 'hour':
                    labels = ['00:00', '00:10', '00:20', '00:30', '00:40', '00:50'];
                    data = [22, 23, 24, 25, 26, 27];
                    break;
                default:
                    break;
            }

            drawChart(labels, data);
        };

        onMounted(() => {
            displayData('year');
        });

        return {
            chart,
            displayData
        };
    }, data() {
        return {
            measurement: null,
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
                const response = await fetch(`http://${this.id}/live`);
                const data = await response.json();
                this.measurement = data.measurements[`${this.selectedParameter}`];
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        },
        changePeriod(period) {
            this.displayData(period);
        },
        getUnit(parameter) {
            const units = {
                temperature: '°C',
                pressure: 'hP',
                humidity: '%',
                light: 'Lux',
                wind_direction: '°',
                wind_speed: 'Kts',
            };
            return units[parameter] || '';
        }
    }
};
</script>

<style scoped>
.measurement {
    margin-top: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.chart-container {
    width: 500px;
    height: auto;
}

.button-container {
    margin-top: 20px;
}

.button-container button {
    margin: 0 5px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>
