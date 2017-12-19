import Vue from 'vue';
import VueTagAutocomplete from '@/VueTagAutocomplete';

import './index.sass';

new Vue({
  el: '#app',
  components: {
    VueTagAutocomplete,
  },
  data: {
    tags: ['SSS', 'AAA','SSS', 'AqweqweqweqAA','SSS', 'AAA','SSS', 'AAA',],
  },
  methods: {
    handleAddition(tag) {
      this.tags = [...this.tag, tag,];
    },
    handleDelete(index) {
      this.tags = [
        ...this.tags.slice(0, index),
        ...this.tags.slice(index + 1, this.tags.length),
      ];
    },
  },
  render() {
    return (
      <div class="container">
        <VueTagAutocomplete
          v-model={this.tags}
          quickMode={true}
          addOnBlur={true}
          // onAdd={this.handleAddition}
          // onDelete={this.handleDelete}
          fontSize="16px"
        />
      </div>
    );
  },
});
