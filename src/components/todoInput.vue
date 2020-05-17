<template>
  <div></div>
</template>
<script>
let uniqId = 1;

export default {
  data: () => ({
    todo: {
      id: 0,
      name: '',
      checked: false,
    },
  }),
  methods: {
    addTodo() {
      this.todo.id = uniqId++;
      this.$emit('addTodo', { ...this.todo });
      this.todo.name = '';
    },
  },
};
</script>
<style lang="scss" scoped src="styles/todoInput.scss"></style>
