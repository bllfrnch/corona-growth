<template>
  <div></div>
</template>
<script>
export default {
  props: {
    todo: Object,
  },
  methods: {
    checkTodo(e) {
      const todoItem = {
        ...this.todo,
        checked: e.target.checked,
      };

      this.$emit('checkTodo', todoItem);
    },
    removeTodo() {
      this.$emit('removeTodo', this.todo.id);
    },
  },
};
</script>
<style src="styles/todoItem.scss" lang="scss" scoped></style>
