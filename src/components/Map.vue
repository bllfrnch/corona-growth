<template>
  <div class="map-container">
    <MglMap :accessToken="accessToken" :mapStyle="mapStyle" @load="onMapLoaded" />
  </div>
</template>
<script>
import Mapbox from 'mapbox-gl';
import { MglMap } from 'vue-mapbox';
import { ACCESS_TOKEN, MAP_STYLE } from '../shared/constants';
export default {
  data() {
    return {
      accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: MAP_STYLE, // your map style
    };
  },
  methods: {
    onMapLoaded(ev) {
      const { map } = ev;
      this.map = map;
      this.map.resize();
    },
  },
  components: {
    MglMap,
  },
};
</script>
<style lang="scss" scoped>
.map-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  // width: 100%;
  // height: 100%;
}
</style>
