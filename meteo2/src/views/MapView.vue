<template>
    <div>
      <h2>Ma carte Leaflet</h2>
      <div id="Map">
        <LeafletMap />
      </div>
      
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


<style>

#Map{
  position: relative;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
}


</style>