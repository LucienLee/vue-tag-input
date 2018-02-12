<template>
  <div class="container">
    <span>Outside a Form</span>
    <VueTagInput
      v-model="tags"
      :suggestions="suggestions"
      :allow-duplicated="false"
      :only-from-suggestions="false"
      :quick-mode="true"
    />
    <br>
    <span>Inside a Form</span>
    <form>
      <input
        type="checkbox"
        v-model="preventDefaultOnEnter">Prevent default on enter
      <VueTagInput
        v-model="tags"
        :suggestions="suggestions"
        :allow-duplicated="false"
        :only-from-suggestions="false"
        :quick-mode="true"
        :prevent-default-on-enter="preventDefaultOnEnter"
      />
    </form>
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
      tags: [],
      // suggestions: ['Japan', 'Taiwan', 'Africa', 'America', 'Canada', 'Finland', 'China'],
      suggestions: ['中國', '中文', '中午', '中飯'],
      preventDefaultOnEnter: true,
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
