<template>
  <div class="map-container">
    <MglMap
      :accessToken="accessToken"
      :center="center"
      :mapStyle="mapStyle"
      :zoom="zoom"
      @load="onMapLoaded"
    />
  </div>
</template>
<script>
import Mapbox from 'mapbox-gl';
import { MglMap } from 'vue-mapbox';
import { ACCESS_TOKEN, MAP_STYLE } from '../shared/constants';
export default {
  data() {
    return {
      accessToken: ACCESS_TOKEN,
      map: undefined,
      center: [-98, 39],
      mapStyle: MAP_STYLE,
      zoom: 4,
    };
  },
  methods: {
    onMapLoaded(ev) {
      const { map } = ev;
      this.map = map;
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
}
</style>
