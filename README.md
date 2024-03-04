# StationMeteo

-> Create Sensors RainCounter.log gpsNmea
```shell
git clone https://gitlab.com/cedricici/fakesonde
cd fakesonde
npm install 
node server.js
```

-> Create Database
```shell
sudo docker run -d --name influxdb -p 8086:8086 -e INFLUXDB_DB=meteodb -v /var/lib/influxdb:/var/lib/influxdb influxdb:1.8
```

-> Fill database
node listener.js

-> Voir la BDD
```shell
sudo docker exec -it influxdb bash
influx -database meteodb
```

-> API Express :3000
node app.js 

-> Centrale :5173
npm run dev

## Résultat

[demo.webm](https://github.com/Matheoia/StationMeteo/assets/121936719/702409d0-eb91-4b5e-8990-dc196d1c74a3)

## Déploiement

sans copier le dashboard en local, mais sans les images
```shell
ssh pi@piensg027
cd ~/StationMeteo/meteo
serve -s dist
```
-> piensg027:3000

sinon : 
```shell
git clone 
cd meteo
npm install
npx vite
```
-> localhost:5173

Les commentaires sont seulement sur ce git.
