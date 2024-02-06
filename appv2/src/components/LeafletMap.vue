<template>
  <div ref="mapContainer" class="leaflet-map"></div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

export default {
  name: 'LeafletMap',
  setup() {
    const mapContainer = ref(null);
    let latitude = 0;
    let longitude = 0;

    onMounted(async () => {
      const map = L.map(mapContainer.value).setView([46.86666, 2.333], 5);

      try {
        const response = await fetch('http://localhost:3000/live/measure/gps');
        const data = await response.json();
        latitude = data.latitude;
        longitude = data.longitude;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const marker1 = L.marker([latitude, longitude]).addTo(map);
        marker1.on('click', () => {
          window.location.href = "/27";
        });


      } catch (error) {
        console.error('Erreur lors de la récupération des données GPS :', error);
      }
    });

    return {
      mapContainer
    };
  }
};
</script>
  
<style scoped>
.leaflet-map {

  position: relative;
  height: 400px;
  width: auto;
}
</style>