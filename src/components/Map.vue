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
import axios from 'axios';
import Mapbox from 'mapbox-gl';
import { MglMap } from 'vue-mapbox';
import { ACCESS_TOKEN, MAP_STYLE } from '../shared/constants';
export default {
  data() {
    return {
      accessToken: ACCESS_TOKEN,
      cases: null,
      center: [-98, 38.88],
      mapStyle: MAP_STYLE,
      zoom: 4,
    };
  },
  methods: {
    onMapLoaded(ev) {
      const { map } = ev;
      console.log(map, map.style);
      map.addSource('states', {
        type: 'vector',
        url: 'mapbox://mapbox.us_census_states_2015',
      });

      map.addSource('counties', {
        type: 'vector',
        url: 'mapbox://mapbox.82pkq93d',
      });

      // STATES
      // map.addLayer(
      //   {
      //     id: 'states-join',
      //     type: 'fill',
      //     source: 'states',
      //     'source-layer': 'states',
      //     paint: {
      //       'fill-color': 'rgba(50, 50, 50, 0.5)',
      //     },
      //   },
      //   'waterway-label'
      // );

      // COUNTIES
      map.addLayer(
        {
          id: 'counties',
          type: 'fill',
          source: 'counties',
          'source-layer': 'original',
          paint: {
            'fill-outline-color': 'rgba(0,0,0,0.1)',
            'fill-color': 'rgba(0,0,0,0.1)',
          },
        },
        'waterway-label'
      ); // Place polygon under these labels.
    },
  },
  mounted() {
    const d = new Date();
    const day = d.getDate() - 1; // TODO: pass max date for which we have data instead of using today
    const month = d.getMonth() + 1; // returns 0 - 11; so helpful
    const year = d.getFullYear();
    const date = `${year}-${month}-${day}`;

    axios.get(`/api/cases/date/${date}/US`).then((response) => {
      console.log(response, response.data);
      this.cases = response.data;
    });
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
