<template>
  <div class="container">
    <VueTagInput
      v-model="tags"
      :suggestions="suggestions"
      :tag-computed-style="computedStyle"
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
      tags: [
        {
          id: 1,
          text: 'Lucien',
          highlight: true,
        },
        {
          id: 2,
          text: 'Bruce',
          highlight: false,
        },
      ],
      suggestions: ['Japan', 'Taiwan', 'Africa'],
    };
  },
  methods: {
    computedStyle(item) {
      return item.highlight ? {
        backgroundColor: 'blue',
        color: '#fff',
      }: {};
    },
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
