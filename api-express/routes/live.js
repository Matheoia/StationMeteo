const express = require('express');
const Influx = require('influx');

const router = express.Router();

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'meteodb',
    username: 'admin',
    password: 'admin',
});

router.get('/', async (req, res) => {
    try {
        var measurements = ['temperature', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg', 'wind_speed_max', 'wind_speed_min'];
        var lastValues = {
            name: "piensg027",
            location: {
                date: new Date().toISOString(),
                coords: null
            },
            status: true,
            measurements: {
                date: new Date().toISOString(),
                rain: null,
                light: null,
                temperature: null,
                humidity: null,
                pressure: null,
                wind: {
                    speed: null,
                    direction: null
                }
            }
        };
        if (req.query.ptdr != null) {
            measurements = ['temperature', 'pressure'];
            lastValues = {
                name: "piensg027",
                location: {
                    date: new Date().toISOString(),
                    coords: null
                },
                status: true,
                measurements: {
                    date: new Date().toISOString(),
                    rain: null,
                    temperature: null,
                    pressure: null,
                }
            };
        }
        await Promise.all(measurements.map(async (measurement) => {
            const result = await influx.query(`SELECT * FROM "${measurement}" ORDER BY time DESC LIMIT 1`);

            if (result.length > 0) {
                switch (measurement) {
                    case 'temperature':
                        lastValues.measurements.temperature = result[0].value;
                        break;
                    case 'pressure':
                        lastValues.measurements.pressure = result[0].value;
                        break;
                    case 'humidity':
                        lastValues.measurements.humidity = result[0].value;
                        break;
                    case 'luminosity':
                        lastValues.measurements.light = result[0].value;
                        break;
                    case 'wind_heading':
                        lastValues.measurements.wind.direction = result[0].value;
                        break;
                    case 'wind_speed_avg':
                        lastValues.measurements.wind.speed = result[0].value;
                        break;
                    case 'wind_speed_max':
                        lastValues.measurements.wind.speed = result[0].value;
                        break;
                    case 'wind_speed_min':
                        lastValues.measurements.wind.speed = result[0].value;
                        break;
                    default:
                        break;
                }
            }
        }));

        // Récupération des dernières valeurs GPS et pluie
        const resultGPS = await influx.query(`SELECT * FROM "gps" ORDER BY time DESC LIMIT 1`);
        const resultRain = await influx.query(`SELECT * FROM "rain" ORDER BY time DESC LIMIT 1`);

        lastValues.measurements.rain = resultRain[0].time;
        lastValues.location.coords = [resultGPS[0].latitude, resultGPS[0].longitude];

        res.json(lastValues);
    } catch (error) {
        console.error('Erreur lors de la récupération des dernières valeurs :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des dernières valeurs' });
    }
});


router.get('/measure/:measure', async (req, res) => {
    try {
        const { measure } = req.params;

        const validMeasurements = ['temperature', 'rain', 'gps', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg', 'wind_speed_max', 'wind_speed_min'];
        if (!validMeasurements.includes(measure)) {
            return res.status(400).json({ error: 'Mesure invalide' });
        }

        const result = await influx.query(`SELECT * FROM "${measure}" ORDER BY time DESC LIMIT 1`);

        if(measure == 'gps'){
            res.json({
                latitude: result[0].latitude,
                longitude: result[0].longitude
            })
        } else if(measure == 'rain') {
            res.json({ measure: result[0].time });
        } else {
            res.json({ measure: result[0].value });
        }

    } catch (error) {
        console.error('Erreur lors de la récupération de la colonne spécifiée :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la colonne spécifiée' });
    }
});


router.get('/wind', async (req, res) => {
    try {
        const measurements = ['wind_heading', 'wind_speed_avg', 'wind_speed_max', 'wind_speed_min'];
        const lastValues = {};

        await Promise.all(measurements.map(async (measurement) => {
            const result = await influx.query(`SELECT * FROM "${measurement}" ORDER BY time DESC LIMIT 1`);

            if (result.length > 0) {
                lastValues[measurement] = {
                    value: result[0].value,
                    time: result[0].time,
                };
            }
        }));
        res.json(lastValues);
    } catch (error) {
        console.error('Erreur lors de la récupération des dernières valeurs :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des dernières valeurs' });
    }
});




module.exports = router;
