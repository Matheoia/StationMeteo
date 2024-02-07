const { time } = require('console');
const fs = require('fs');
const Influx = require('influx');
const nmea = require("nmea-simple");

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'meteodb',
    username: 'admin',
    password: 'admin',
});

const sensorsFilePath = '/dev/shm/sensors';
const rainCounterFilePath = '/dev/shm/rainCounter.log';
const gpsNmeaFilePath = '/dev/shm/gpsNmea';


// Surveiller les changements du fichier sensors
fs.watch(sensorsFilePath, (eventType, filename) => {
    if (filename) {
        // console.log(`Le fichier ${filename} a été modifié`);

        // Lire le contenu du fichier
        fs.readFile(sensorsFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Erreur lors de la lecture du fichier ${filename} :`, err);
                return;
            }

            // Parse et insère les données
            try {
                const jsonData = JSON.parse(data);
                const { date, measure } = jsonData;
        
                // Préparer les points de données à insérer
                const points = measure.map(({ name, value }) => ({
                    measurement: name,
                    tags: {},
                    fields: { value: parseFloat(value) },
                    timestamp: new Date(date),
                }));
        
                // Insérer les points de données dans la base de données InfluxDB
                influx.writePoints(points).then(() => {
                    console.log('v ADD SENSORS');
                }).catch(err => {
                    console.error(`x ADD SENSORS : ${err}`);
                });
        
            } catch (error) {
                console.error('Erreur lors du parsing des données JSON :', error);
            }
        });
    }
});


// Surveiller les changements du fichier rainCounter.log
fs.watch(rainCounterFilePath, (eventType, filename) => {
    if (filename) {
        // console.log(`Le fichier ${filename} a été modifié`);

        // Lire le contenu du fichier
        fs.readFile(rainCounterFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Erreur lors de la lecture du fichier ${filename} :`, err);
                return;
            }
            try {
                const timestamp = new Date(data.trim());
               
                influx.writePoints([
                    {
                        measurement: 'rain',
                        fields: { amount: 1 },
                        timestamp: timestamp,
                    }
                ]).then(() => {
                    console.log('v ADD RAIN');
                }).catch(err => {
                    console.error(`x ADD RAIN : ${err.stack}`);
                });

            } catch (error) {
                console.error('Erreur lors du parsing des données JSON :', error);
            }
           
        });
    }
});

fs.watch(gpsNmeaFilePath, (eventType, filename) => {
    if (filename) {
        // console.log(`Le fichier ${filename} a été modifié`);

        fs.readFile(gpsNmeaFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Erreur lors de la lecture du fichier ${filename} :`, err);
                return;
            }

            try {
                const goodData = nmea.parseNmeaSentence(data.split('\n')[0]);

                influx.writePoints([
                    {
                        measurement: 'gps',
                        fields: {
                            latitude: goodData.latitude,
                            longitude: goodData.longitude,
                            name: 'gps'
                        },
                    }
                ])
                .then(() => {
                    console.log('v ADD GPS');
                }).catch(err => {
                    console.error(`x ADD GPS ${err.stack}`);
                });
            } catch (error) {
                console.error('Erreur lors du traitement des données NMEA :', error);
            }
        });
    }
});
