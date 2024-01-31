const fs = require('fs');
const Influx = require('influx');

const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'meteodb',
    username: 'admin',
    password: 'admin',
});

const filePath = '/dev/shm/sensors';

function parseAndInsertData(data) {
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
            console.log('Données insérées avec succès dans InfluxDB');
        }).catch(err => {
            console.error(`Erreur lors de l'insertion des données dans InfluxDB : ${err}`);
        });

    } catch (error) {
        console.error('Erreur lors du parsing des données JSON :', error);
    }
}

// Surveiller les changements du fichier sensors
fs.watch(filePath, (eventType, filename) => {
    if (filename) {
        console.log(`Le fichier ${filename} a été modifié`);

        // Lire le contenu du fichier
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Erreur lors de la lecture du fichier ${filename} :`, err);
                return;
            }

            // Parse et insère les données
            parseAndInsertData(data);
        });
    }
});