<script>
export default {
  name: "VueTagAutocomplete",
  props: {
    value: {
      type: Array,
      required: true,
      validator(array) {
        return array.reduce((acc, item) => {
          return acc && (typeof item === 'string' || (item.id && item.name));
        }, true);
      },
    },
    placeholder: {
      type: String,
      required: false,
      default: "Enter your tags",
    },
    // Add a tag if input blurs
    addOnBlur: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data () {
    return {
      name: 'World',
    };
  },
  computed: {
    tags() {
      return this.value;
    },
  },
  render() {
    return (
      <div>
        <h1>{this.value}</h1>
        <p>ee</p>
      </div>
    );
  },
};
</script>

<style scoped>
  h1 {
    color:aqua;
  }
</style>

