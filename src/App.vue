<template>
  <div id="#app">
    App:
    <todo></todo>
  </div>
</template>

<script>
import todo from './components/todo';
export default {
  name: 'app',
  components: {
    todo,
  },
};
</script>

<style lang="scss"></style>
