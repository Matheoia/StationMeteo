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

    onMounted(() => {
      const map = L.map(mapContainer.value).setView([46.86666, 2.333], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker1 = L.marker([48.86666, 2.333]).addTo(map);
      marker1.bindPopup("<b>ensgpi27</b>");
      marker1.on('click', () => {
        window.location.href = "/27";
      });

      const marker2 = L.marker([45.86666, 2.333]).addTo(map);
      marker2.bindPopup("<b>ensgpi28</b>");

      marker2.on('click', () => {
        window.location.href = "/28";
      });

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
}
</style>