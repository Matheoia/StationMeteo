<!-- 
    Représente les détails d'une sonde. Contient le graphique, les deux dates, l'intervalle et le bouton pour lancer fetchArchive qui va 
    chercher les informations en fonction des trois paramètres au dessus et les envoie à drawChart qui redessine par dessus avec ces
    nouvelles données.

    disableFive et disableHour permettent de désactiver l'option si la différence entre le début et la fin est trop grande.
    Cette différence de jours est calculée via une fonction, et est appelée si on change une date.
 -->


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
            <select v-model="interval" id="interval">
                <option value="5m" :disabled="disableFive">5 minutes</option>
                <option value="1h" :disabled="disableHour">1 Heure</option>
                <option value="1d">1 Jour</option>
                <option value="7d">1 Semaine</option>
            </select>
        </div>
        <div>
            <button @click="fetchArchive">Fetch</button>
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

        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yearYesterday = yesterday.getFullYear();
        const monthYesterday = (yesterday.getMonth() + 1).toString().padStart(2, '0');
        const dayYesterday = yesterday.getDate().toString().padStart(2, '0');

        return {
            measurement: null,
            debut: `${yearYesterday}-${monthYesterday}-${dayYesterday}`,
            fin: `${year}-${month}-${day}`,
            heureDebut: '00:00',
            heureFin: '00:00',
            interval: '5m',

            disableFive: false,
            disableHour: false,

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
            this.disableFive = this.calculateDaysDifference() > 1;
            this.disableHour = this.calculateDaysDifference() > 7;
            if (this.disableFive) {
                this.interval = "1h";
            }
            if (this.disableHour) {
                this.interval = "1d";
            }
        },
        fin() {
            this.disableFive = this.calculateDaysDifference() > 1;
            this.disableHour = this.calculateDaysDifference() > 7;

            if (this.disableFive) {
                this.interval = "1h";
            }
            if (this.disableHour) {
                this.interval = "1d";
            }
        }
    },

    methods: {

        calculateDaysDifference() {
            const debutDate = new Date(this.debut);
            const finDate = new Date(this.fin);
            const differenceInTime = finDate.getTime() - debutDate.getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);

            return differenceInDays;
        },

        drawChart(labels, data) {
            const chartCanvas = this.$refs.chart;
            const ctx = chartCanvas.getContext('2d');

            if (chartCanvas.chart) {
                chartCanvas.chart.destroy();
            }

            const labelFormat = this.disableFive ? 'DD/MM/YYYY' : 'HH:mm';

            chartCanvas.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.map(date => {
                        if (!this.disableFive) {
                            return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                        } else {
                            return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
                        }
                    }),
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
            // fetch les données live
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

            // fetch les données archive

            // si requête trop longue, on arrête
            const controller = new AbortController();
            const signal = controller.signal;

            const timeoutId = setTimeout(() => {
                controller.abort();
                console.log('La requête a pris trop de temps, elle a été annulée.');
            }, 5000);

            try {
                const [yearDebut, monthDebut, dayDebut] = this.debut.split('-').map(Number);
                const [hoursDebut, minutesDebut] = this.heureDebut.split(':').map(Number);
                const dateDebut = new Date(yearDebut, monthDebut - 1, dayDebut, hoursDebut, minutesDebut);

                const [yearFin, monthFin, dayFin] = this.fin.split('-').map(Number);
                const [hoursFin, minutesFin] = this.heureFin.split(':').map(Number);
                const dateFin = new Date(yearFin, monthFin - 1, dayFin, hoursFin, minutesFin);

                if (dateFin.getTime() - dateDebut.getTime() > 0) {
                    let url = `http://${this.id}/archive?from=${this.debut}T${this.heureDebut}:00&to=${this.fin}T${this.heureFin}:00&interval=${this.interval}`;

                    if (this.id === 'piensg030') {
                        url = `http://${this.id}/archive?from=${this.debut}&to=${this.fin}&interval=${this.interval}`;
                    }

                    const response = await fetch(url, { signal });
                    const data = await response.json();

                    if (this.selectedParameter !== 'wind') {
                        this.drawChart(data.measurements.date, data.measurements[this.selectedParameter]);
                    } else {
                        this.drawChart(data.measurements.date, data.measurements[this.selectedParameter].speed);
                    }
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('La requête a été annulée car elle a pris trop de temps.');
                } else {
                    console.error('Erreur lors de la récupération des données:', error);
                }
            } finally {
                clearTimeout(timeoutId);
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
    width: 100%;
    height: auto;

    background-color: white;
}

.arrow {

    width: auto;
    height: 100px;
}


.date-debut-container,
.date-fin-container,
div {
    margin-bottom: 10px;
}

label {
    display: inline-block;
    width: 80px;
}

input[type="date"],
input[type="time"],
select {
    width: 150px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

option:disabled {
    color: #999;
    cursor: not-allowed;
}
</style>
