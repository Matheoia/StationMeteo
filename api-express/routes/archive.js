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
        const { from, to = 'now', filter = 'all', interval = '5m' } = req.query;

        // Convertit le paramètre 'from' en epoch ( UTC )
        const fromEpoch = Date.parse(from) * 1000000;
        let influxQuery = '';
        let gpsQuery = '';
        let rainQuery = '';
        let measurements = [];
        let toEpoch = 0;

        if (to == 'now') {
            toEpoch = Date.now() * 1000000;
        } else {
            toEpoch = Date.parse(to) * 1000000;
        }

        if (filter == 'all') {
            //Créée la liste des mesure que l'on veut
            measurements = ['temperature', 'rain', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg'];
        } else {
            measurements = filter.split(',')
        }
        console.log(measurements)
        await Promise.all(measurements.map(async (measurement) => {

            influxQuery += `SELECT MEAN(*) AS ${measurement} FROM "${measurement}" WHERE time >= ${fromEpoch}`;
            gpsQuery += `SELECT MEAN(*) AS gps FROM "gps" WHERE time >= ${fromEpoch}`;
            rainQuery += `SELECT MEAN(*) AS rain FROM "rain" WHERE time >= ${fromEpoch}`;

            console.log("requetes initialisées");

            influxQuery += ` AND time <= ${toEpoch}`;
            gpsQuery += ` AND time <= ${toEpoch}`;
            rainQuery += ` AND time <= ${toEpoch}`;

            console.log("argument to géré");

            influxQuery += ` GROUP BY time(${interval})`;
            gpsQuery += ` GROUP BY time(${interval})`;
            rainQuery += ` GROUP BY time(${interval})`;

            console.log("argument interval géré");
            influxQuery += ";"
            gpsQuery += ";"
            rainQuery += ";"
            console.log(influxQuery)
        }));
        const result = await influx.query(influxQuery);
        const resultGPS = await influx.query(gpsQuery);
        const resultRain = await influx.query(rainQuery);
        console.log(result)
        console.log(measurements.indexOf('temperature'))

        const tab_press = measurements.indexOf('pressure') !== -1 ? result[measurements.indexOf('pressure')].map(press => press.pressure_value) : [];
        const tab_temp = measurements.indexOf('temperature') !== -1 ? result[measurements.indexOf('temperature')].map(temp => temp.temperature_value) : [];
        const tab_lum = measurements.indexOf('luminosity') !== -1 ? result[measurements.indexOf('luminosity')].map(light => light.luminosity_value) : [];
        const tab_hum = measurements.indexOf('humidity') !== -1 ? result[measurements.indexOf('humidity')].map(hum => hum.humidity_value) : [];
        const tab_wspeed = measurements.indexOf('wind_speed_avg') !== -1 ? result[measurements.indexOf('wind_speed_avg')].map(wind => wind.wind_speed_avg_value) : [];
        const tab_wdir = measurements.indexOf('wind_heading') !== -1 ? result[measurements.indexOf('wind_heading')].map(wind => wind.wind_heading_value) : [];
        const tab_rain = 0.3274 * measurements.indexOf('rain') !== -1 ? resultRain[measurements.indexOf('rain')].map(rain => rain.rain_value) : [];
        console.log(resultRain);
        const finalJson = {
            name: 'piensg027',
            status: 1,
            location: {
                date: resultGPS[0].map(obj => obj.time),
                coords: [resultGPS[0].map(obj => obj.gps_latitude), resultGPS[0].map(obj => obj.gps_longitude)],
            },
            measurements: {
                date: result[0].map(obj => obj.time),
                pressure: tab_press,
                temperature: tab_temp,
                rain: tab_rain,
                wind: {
                    speed: tab_wspeed,
                    direction: tab_wdir,
                },
                light: tab_lum,
                humidity: tab_hum,
            }
        }
        res.json(finalJson);
    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'archive :', error);
        res.status(500).json({ error });
    }
});

module.exports = router;