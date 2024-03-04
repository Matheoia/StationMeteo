const express = require('express');
const Influx = require('influx');

const router = express.Router();

//Logins de la DB Influx
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'meteodb',
    username: 'admin',
    password: 'admin',
});

router.get('/', async (req, res) => {
    try {
        let { from, to = 'now', filter = 'all', interval = '1d' } = req.query;

        // Convertit le paramètre 'from' en epoch ( UTC )
        const fromEpoch = Date.parse(from) * 1000000;
        //Initialisation des paramètres
        let influxQuery = '';
        let gpsQuery = '';
        let rainQuery = '';
        let measurements = [];
        let toEpoch = 0;

        //Gestion du cas from == to
        if (to == 'now') {
            toEpoch = Date.now() * 1000000;
        } else {
            toEpoch = Date.parse(to) * 1000000;
            //console.log(to, toEpoch);
        } if (toEpoch == fromEpoch && toEpoch % 86400000000000 == 0) {
            toEpoch += 86399000000000;
        }

	//console.log(toEpoch - fromEpoch);
        //Ajustement de l'intervalle minimum en fonction de la plage de données voulue
        switch (interval.slice(-1)) {
            case 'h':
                if (toEpoch - fromEpoch >= 86400000000000 * 7) {
                    interval = '1d';
                }
		break;
            case 'm':
                if (toEpoch - fromEpoch >= 86400000000000) {
		    interval = '1h';
                }
		if (toEpoch - fromEpoch >= 86400000000000 * 7) {
                    interval = '1d'
                }
		break;
            case 's':
                if (toEpoch - fromEpoch >= 86400000000000 / 24) {
                    interval = '5m';
                }
		if (toEpoch - fromEpoch >= 86400000000000) {
                    interval = '1h';
                }
		if (toEpoch - fromEpoch >= 86400000000000 * 7) {
                    interval = '1d';
                }
	        break;
        }

	console.log(interval);
        if (filter == 'all') {
            //Créée la liste des mesure que l'on veut
            measurements = ['temperature', 'rain', 'pressure', 'humidity', 'luminosity', 'wind_heading', 'wind_speed_avg'];
        } else {
            measurements = filter.split(',')
        }
        //console.log(measurements)
        await Promise.all(measurements.map(async (measurement) => {

            //On séléctionne les données plus récentes que from
            influxQuery += `SELECT MEAN(*) AS ${measurement} FROM "${measurement}" WHERE time >= ${fromEpoch}`;
            gpsQuery += `SELECT MEAN(*) AS gps FROM "gps" WHERE time >= ${fromEpoch}`;
            rainQuery += `SELECT COUNT(*) AS rain FROM "rain" WHERE time >= ${fromEpoch}`;

            //Celles plus anciennes que to    
            influxQuery += ` AND time <= ${toEpoch}`;
            gpsQuery += ` AND time <= ${toEpoch}`;
            rainQuery += ` AND time <= ${toEpoch}`;

            //Échantillonnées en fonction de l'intervalle
            influxQuery += ` GROUP BY time(${interval})`;
            gpsQuery += ` GROUP BY time(${interval})`;
            rainQuery += ` GROUP BY time(${interval})`;

            influxQuery += ";"
            gpsQuery += ";"
            rainQuery += ";"
            // console.log(influxQuery)
        }));
        const result = await influx.query(influxQuery);
        const resultGPS = await influx.query(gpsQuery);
        const resultRain = await influx.query(rainQuery);
        //console.log(result)
        //console.log(measurements.indexOf('temperature'))

        //Parsing des résultats SQL et construction du JSON
        const tab_press = measurements.indexOf('pressure') !== -1 ? result[measurements.indexOf('pressure')].map(press => press.pressure_value) : [];
        const tab_temp = measurements.indexOf('temperature') !== -1 ? result[measurements.indexOf('temperature')].map(temp => temp.temperature_value) : [];
        const tab_lum = measurements.indexOf('luminosity') !== -1 ? result[measurements.indexOf('luminosity')].map(light => light.luminosity_value) : [];
        const tab_hum = measurements.indexOf('humidity') !== -1 ? result[measurements.indexOf('humidity')].map(hum => hum.humidity_value) : [];
        const tab_wspeed = measurements.indexOf('wind_speed_avg') !== -1 ? result[measurements.indexOf('wind_speed_avg')].map(wind => wind.wind_speed_avg_value) : [];
        const tab_wdir = measurements.indexOf('wind_heading') !== -1 ? result[measurements.indexOf('wind_heading')].map(wind => wind.wind_heading_value) : [];
        //console.log(resultRain);
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
                rain: resultRain[0].map(obj => 0.3274 * obj.rain_amount),
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
