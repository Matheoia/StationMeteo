<template>
    <div class="measurement">
        <p>Actuellement : {{ measurement }} {{ getUnit(selectedParameter) }}</p>
        <div v-if="selectedParameter == 'wind'">
            <img ref="arrow" class="arrow" src="../components/icons/arrow.png">
        </div>
        <div class="chart-container">
            <canvas ref="chart"></canvas>
        </div>
        <div class="date-debut-container">
            <label for="debut">Début</label>
            <input type="date" id="debut" v-model="debut">

            <label for="heureDebut"></label>
            <input type="time" id="heureDebut" v-model="heureDebut">
        </div>
        <div class="date-fin-container">
            <label for="fin">Fin :</label>
            <input type="date" id="fin" v-model="fin">

            <label for="heureFin"></label>
            <input type="time" id="heureFin" v-model="heureFin">
        </div>
        <div>
            <label for="interval">Intervalle :</label>
            <input type="int" id="interval" v-model="interval">
        </div>

    </div>
</template>

<script>

import Chart from 'chart.js/auto';

export default {
    name: 'OneMeasure',
    props: {
        id: String,
        selectedParameter: String,
        measurement: String
    },
    data() {

        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return {
            measurement: null,
            debut: '2024-02-28',
            fin: `${year}-${month}-${day}`,
            heureDebut: '00:00',
            heureFin: '00:00',
            interval: '1d',
        };
    },
    created() {
        this.fetchData();
        this.fetchArchive();
    },
    watch: {
        selectedParameter() {
            this.fetchData();
            this.fetchArchive();
        },
        debut() {
            this.fetchArchive();
        },
        fin() {
            this.fetchArchive();
        },
        heureDebut() {
            this.fetchArchive();
        },
        heureFin() {
            this.fetchArchive();
        },
        interval() {
            this.fetchArchive();
        }
    },

    methods: {

        drawChart(labels, data) {

            const chartCanvas = this.$refs.chart;
            const ctx = chartCanvas.getContext('2d');

            if (chartCanvas.chart) {
                chartCanvas.chart.destroy();
            }

            chartCanvas.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.map(date => new Date(date).toLocaleDateString()),
                    datasets: [{
                        label: `${this.selectedParameter} (${this.getUnit(this.selectedParameter)})`,
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                }
            });
        },

        async fetchData() {
            try {
                const response = await fetch(`http://${this.id}/live`);
                const data = await response.json();
                if (this.selectedParameter == 'wind') {
                    const arrow = this.$refs.arrow;
                    arrow.style.rotate = `${data.measurements.wind.direction}deg`;
                    this.measurement = data.measurements[`${this.selectedParameter}`].speed;
                } else {
                    this.measurement = data.measurements[`${this.selectedParameter}`];
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        },


        async fetchArchive() {

            const [yearDebut, monthDebut, dayDebut] = this.debut.split('-').map(Number);
            const [hoursDebut, minutesDebut] = this.heureDebut.split(':').map(Number);
            const dateDebut = new Date(yearDebut, monthDebut - 1, dayDebut, hoursDebut, minutesDebut);

            const [yearFin, monthFin, dayFin] = this.fin.split('-').map(Number);
            const [hoursFin, minutesFin] = this.heureFin.split(':').map(Number);
            const dateFin = new Date(yearFin, monthFin - 1, dayFin, hoursFin, minutesFin);

            if (dateFin.getTime() - dateDebut.getTime() > 0) {

                if (this.interval.length == 2) {

                    try {
                        const response = await fetch(`http://${this.id}/archive?from=${this.debut}T${this.heureDebut}:00&to=${this.fin}T${this.heureFin}:00&interval=${this.interval}`);
                        const data = await response.json();

                        if (this.selectedParameter != 'wind') {
                            this.drawChart(data.measurements.date, data.measurements[this.selectedParameter]);
                        } else {

                            this.drawChart(data.measurements.date, data.measurements[this.selectedParameter].speed);
                        }
                    } catch (error) {
                        console.error('Erreur lors de la récupération des données:', error);
                    }
                } else {

                    try {
                        const response = await fetch(`http://${this.id}/archive?from=${this.debut}T${this.heureDebut}:00&to=${this.fin}T${this.heureFin}:00`);
                        const data = await response.json();

                        if (this.selectedParameter != 'wind') {
                            this.drawChart(data.measurements.date, data.measurements[this.selectedParameter]);
                        } else {

                            this.drawChart(data.measurements.date, data.measurements[this.selectedParameter].speed);
                        }

                    } catch (error) {
                        console.error('Erreur lors de la récupération des données:', error);
                    }

                }
            }

        },
        getUnit(parameter) {
            const units = {
                temperature: '°C',
                pressure: 'hP',
                humidity: '%',
                light: 'Lux',
                wind: 'Kts',
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

    background-color: white;
}

.arrow {

    width: auto;
    height: 100px;
}
</style>