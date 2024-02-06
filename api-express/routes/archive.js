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

        // Convert 'from' parameter to epoch
        const fromEpoch = Date.parse(from) * 1000000;

        //Initialise les requêtes
        let influxQuery = '';
        let gpsQuery = '';
        let rainQuery = '';
        let measurements = [];
        let toEpoch = 0;
        try {
            if (to == 'now') {
                toEpoch = Date.now() * 1000000;
            } else {
                toEpoch = Date.parse(to) * 1000000;
            }
        } catch {
            console.error('Paramètre "to" non valide', error);
            res.status(400).json({ error });
        }

        try {
            if (filter == 'all') {
                //Créée la liste des mesure que l'on veut
                measurements = ['temperature', 'rain', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg'];
            } else {
                measurements = filter.split(',')
            }
        } catch {
            console.error('Paramètres de filtre non valides', error)
            res.status(400).json({ error });
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
        let tab_temp,tab_press,tab_rain,tab_wspeed,tab_wdir,tab_lum,tab_hum = [];
        if(measurements.indexOf('pressure') != -1){
            tab_press = result[measurements.indexOf('pressure')].map(press => press.pressure_value)
        }
        if(measurements.indexOf('temperature') != -1){
            tab_temp = result[measurements.indexOf('temperature')].map(temp => temp.temperature_value)
        }
        if(measurements.indexOf('luminosity') != -1){
            tab_lum = result[measurements.indexOf('luminosity')].map(light => light.luminosity_value)
        }
        if(measurements.indexOf('humidity') != -1){
            tab_hum = result[measurements.indexOf('humidity')].map(hum => hum.humidity_value)
        }
        if(measurements.indexOf('wind_heading') != -1){
            tab_wspeed = result[measurements.indexOf('wind_heading')].map(wind => wind.wind_speed_avg_value)
        }
        if(measurements.indexOf('wind_heading') != -1){
            tab_wdir = result[measurements.indexOf('wind_heading')].map(wind => wind.wind_heading_value)
        }
        if(measurements.indexOf('wind_speed_avg') != 1){
            tab_wspeed = result[measurements.indexOf('wind_speed_avg')].map(wind => wind.wind_speed_avg_value);
        }
        console.log(resultGPS);
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
                humidity: tab_hum , 
            }
        }
        /*const reformattedData = {
            name: 'piensg027',
            status: 1,
            location: {
                date: Date(),
                coords: result.map(item => [item.gps_latitude, item.gps_longitude]),
            },
            measurements: {
                /*date: item.map(subitem => subitem.time),
                pressure: Array.from(item, subitem =>
                    subitem.pressure_value
                ),
                temperature: result[measurements.indexOf('temperature')].map(temp => temp.temperature_value),
                rain: item.rain_amount,
                wind: {
                    speed: item.wind_speed_avg_value,
                    direction: item.wind_heading_value,
                },
                light: item[5].luminosity_value,
                humidity: item[4].humidity_value,
            },
        };*/
        res.json(finalJson);
        //res.json(result);


    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'archive :', error);
        res.status(500).json({ error });
    }
});

module.exports = router;