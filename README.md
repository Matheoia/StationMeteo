# StationMeteo

-> Create Sensors RainCounter.log gpsNmea
git clone fakesonde
cd fakesonde
npm install 
node server.js

-> Create Database
sudo docker run -d --name influxdb -p 8086:8086 -e INFLUXDB_DB=meteodb -e INFLUXDB_ADMIN_USER=admin -e INFLUXDB_ADDMIN_PASSWORD=admin -v /var/lib/influxdb:/var/lib/influxdb influxdb:1.8

-> Fill database
node listener.js

-> Voir la BDD
sudo docker exec -it influxdb bash
influx -username admin -password admin -database meteodb

-> API Express :3000
node app.js 

-> Centrale :5173
npm run dev
