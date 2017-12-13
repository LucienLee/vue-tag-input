<template>
  <div>
    <h1>{{ name }}</h1>
  </div>
</template>

<script>
export default {
  name: "Vue",
  data () {
    return {
      name: 'World',
    };
  },
  mounted() {
  },
};
</script>

<style scoped>
  h1 {
    color:aqua;
  }
</style>

