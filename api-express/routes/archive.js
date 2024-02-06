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
        const { from, to, filter, interval } = req.query;

        // Convert 'from' parameter to epoch
        const fromEpoch = Date.parse(from) * 1000000;

        // Vérifier si les paramètres facultatifs sont présents
        const hasTo = to !== undefined;
        const hasFilter = filter !== undefined;
        const hasInterval = interval !== undefined && /^\d+[a-zA-Z]$/.test(interval);

        if (filter == 'all' || filter == undefined) {
            
            await Promise.all(measurements.map(async (measurement) => {

                let influxQuery = `SELECT * FROM "${measurement}" WHERE time >= ${fromEpoch}`
                let gpsQuery = `SELECT * FROM "gps" WHERE time >= ${fromEpoch} `;
                let rainQuery = `SELECT * FROM "rain" WHERE time >= ${fromEpoch}`

                if (hasTo) {
                    const toEpoch = Date.parse(to) * 1000000;
                    influxQuery += ` AND time <= '${toEpoch}'`
                    gpsQuery += ` AND time <= '${toEpoch}'`
                    rainQuery += ` AND time <= '${toEpoch}'`;
                }

                if (hasInterval) {
                    //
                    influxQuery += ` GROUP BY time(${interval})`
                    gpsQuery += ` GROUP BY time(${interval})`
                    rainQuery += ` GROUP BY time${interval})}`
                    /*const units = {
                        's': 1,
                        'm': 60,
                        'h': 3600,
                        'D': 86400,
                        'M': 2592000,
                        'Y': 31104000
                    }
                    const unit = interval.slice(-1);
                    const value = parseInt(interval.slice(0,-1))
                    const seconds = value * units[unit]*/
                }

                result = await influx.query(influxQuery);
                resultGPS = await influx.query(gpsQuery);
                resultRain = await influx.query(rainQuery);

            }));
            
        }
        else{
            filter.forEach(metrique => {
                let influxQuery = `SELECT * FROM "${metrique}" WHERE time >= ${fromEpoch}`;

                if (hasTo) {
                    const toEpoch = Date.parse(to) * 1000000;
                    influxQuery += ` AND time <= '${toEpoch}'`;
                }

                if (hasInterval) {
                    //Gérer les intervalles
                }
            });
        }


            const result = await influx.query(influxQuery);

            res.json(result);
        } catch (error) {
            console.error('Erreur lors de la récupération des données d\'archive :', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des données d\'archive' });
        }
    });
