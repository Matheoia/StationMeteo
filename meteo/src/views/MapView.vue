<!-- 
    Vue de la carte qui contient simplement le composant LeafletMap et le stylise
 -->


<template>
  <div>
    <LeafletMap id="MapAlone" />
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
#MapAlone {
  position: absolute;
  top: 5vh;
  left: 0;

  width: 100vw;
  height: 95vh;
}
</style>
