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
