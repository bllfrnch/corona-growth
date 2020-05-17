<template> </template>
<script>
export default {
  props: {
    todos: Array,
  },
  data: () => ({
    filter: 'all',
  }),
  computed: {
    filteredTodos() {
      switch (this.filter) {
        case 'all':
          return this.todos;
        case 'active':
          return this.todos.filter((item) => !item.checked);
        case 'compleated':
          return this.todos.filter((item) => item.checked);
      }
    },
  },
  methods: {
    applyFilter(filter) {
      this.filter = filter;
    },
    checkTodo(todo) {
      this.$emit('checkTodo', todo);
    },
    removeTodo(todoId) {
      this.$emit('removeTodo', todoId);
    },
  },
  components: {
    todoItem: require('./todoItem'),
  },
};
</script>
<style src="styles/todoList.scss" lang="scss" scoped></style>
