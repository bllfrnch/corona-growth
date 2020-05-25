<template>
  <div class="app-wrapper">
    <section class="preamble">
      <h1>Visualizing the Roni</h1>
      <nav>
        <ul>
          <li><a href="#by-state" @click="boundary = 'state'">By state</a></li>
          <li><a href="#by-county" @click="boundary = 'county'">By county</a></li>
        </ul>
      </nav>
    </section>
    <section class="map-wrapper">
      <Map :boundary="boundary" />
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
  methods: {
    // setBoundary(boundary) {
    //   this.boundary = boundary;
    // },
  },
  data() {
    return {
      boundary: 'state',
    };
  },
  created() {
    console.log(`CREATED ${this.boundary}`);
  },
  updated() {
    console.log(`UPDATED ${this.boundary}`);
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
