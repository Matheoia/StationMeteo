<template>
  <div ref="mapContainer" class="leaflet-map"></div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'LeafletMap',
  setup() {
    const mapContainer = ref(null);
    const urls = ['piensg027', 'piensg028', 'piensg030', 'piensg031', 'piensg032',];

    onMounted(async () => {
      const map = L.map(mapContainer.value).setView([46.86666, 2.333], 2);

      for (const url of urls) {

        try {

          const response = await fetch(`http://${url}:80/live`);
          const data = await response.json();
          const latitude = data.location.coords['0'];
          const longitude = data.location.coords['1'];

          L.marker([latitude, longitude])
            .addTo(map)
            .on('click', () => {
              window.location.href = `/sondes/${url}`;
            });

        } catch (error) {
          console.error('Erreur lors de la récupération des données GPS :', error);
        }

      }

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

    });

    return {
      mapContainer
    };
  }
};
</script>
  
<style scoped></style>
