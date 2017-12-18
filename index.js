import Vue from 'vue';
import VueTagAutocomplete from '@/VueTagAutocomplete';

import './index.sass';

new Vue({
  el: '#app',
  components: {
    VueTagAutocomplete,
  },
  data: {
    tags: [],
  },
  render() {
    return (
      <div class="container">
        <VueTagAutocomplete
          v-model={this.tags}
        />
      </div>
    );
  },
});
