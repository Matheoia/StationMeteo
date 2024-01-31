<template>
    <div>
      <h2>Ma carte Leaflet</h2>
      <LeafletMap />
    </div>
  </template>
  
  <script>
  import LeafletMap from '../components/LeafletMap.vue';
  
  export default {
    components: {
      LeafletMap
    }
  };
  </script>