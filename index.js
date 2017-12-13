import Vue from 'vue';
import VueTagAutocomplete from './src/VueTagAutocomplete';

new Vue({
  el: '#app',
  components: {
    VueTagAutocomplete,
  },
  render() {
    return (
      <div>
        <VueTagAutocomplete/>
      </div>
    );
  },
});
