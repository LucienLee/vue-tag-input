<template>
  <div class="container">
    <VueTagInput
      v-model="tags"
      :suggestions="suggestions"
      :quick-mode="true"
    />
  </div>
</template>

<script>
import VueTagInput from '@/VueTagInput';

export default {
  components: {
    VueTagInput,
  },
  data() {
    return {
      tags: ['SSS', 'AAA','SSS', 'AqweqweqweqAA','SSS', 'AAA','SSS', 'AAA'],
      suggestions: ['Japan', 'Taiwan', 'Africa'],
    };
  },
};
</script>

<style lang="sass">
// style for development playgrond
body
  margin: 0
  padding: 0

.container
  margin: 30px auto
  width: 100%
  max-width: 600px
</style>
