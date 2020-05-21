<template>
  <div class="map-container">
    Here's the map:
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
    },
    // addNewTodo(todo) {
    //   this.todos.push(todo);
    // },
    // checkTodo(todo) {
    //   this.todos = this.todos.map((item) => (item.id === todo.id ? todo : item));
    // },
    // removeTodo(todoId) {
    //   this.todos = this.todos.filter((item) => item.id !== todoId);
    // },
  },
  components: {
    MglMap,
  },
};
</script>
<style lang="scss" scoped>
.map-container {
  width: 100%;
  height: 80vh;
}
</style>
