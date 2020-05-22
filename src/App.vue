<template>
  <div class="app-wrapper">
    <section class="preamble">
      <h1>Visualizing the Roni</h1>
    </section>
    <section class="map-wrapper">
      <Map />
    </section>
  </div>
</template>

<script>
import Map from './components/Map';
export default {
  name: 'app',
  components: {
    Map,
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.preamble {
  h1 {
    margin: 0;
  }
}

.map-wrapper {
  flex: 1;
  position: relative;
}
</style>
