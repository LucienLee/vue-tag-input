<script>
export default {
  name: 'TagInputSuggestions',
  props: {
    query: {
      type: String,
      required: true,
    },
    suggestions: {
      type: Array,
      required: true,
    },
    selectedIndex: {
      type: Number,
      required: true,
    },
  },
  methods: {
    escapeForRegExp(query) {
      return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    handleMousedown(item, e) {
      // prevents input focus shifted on mouse down
      e.preventDefault();
      this.$emit('select', item);
    },
  },
  render() {
    return (
      <ul
        class='TagInput-suggestions'
        role='listbox'
      >
        {this.suggestions.map((item, index) =>
          <li
            class={['TagInput-suggestionItem', {'is-active': this.selectedIndex === index}]}
            key={item.id}
            role='option'
            onMousedown={this.handleMousedown.bind(this, item)}
          >
            {item.text}
          </li>,
        )}
      </ul>
    );
  },
};
</script>

<style lang="sass">
.TagInput-suggestions
  position: absolute
  top: 100%
  left: 0
  z-index: 1
  box-sizing: border-box
  overflow-y: scroll
  list-style: none
  padding: 0
  margin: 0

  width: 240px
  max-height: 400px
  background: #fff
  color: #808389
  border: 1px solid var(--border-color)
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12)

.TagInput-suggestionItem
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  padding: 0.4em 0.8em
  cursor: pointer

  & + .TagInput-suggestionItem
    border-top: 1px solid var(--border-color)

  &:hover
    background-color: rgba(0, 0, 0, 0.06)

.TagInput-suggestionItem.is-active
  background-color: rgba(#54bf8e, 0.2)
  color: #54bf8e

</style>

