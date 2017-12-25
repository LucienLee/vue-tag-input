<script>
export default {
  name: 'TagInputSuggestions',
  props: {
    items: {
      type: Array,
      required: true,
    },
    selectedIndex: {
      type: Number,
      required: true,
    },
  },
  methods: {
    handleMousedown(item, e) {
      // prevents input focus shifted on mouse down
      e.preventDefault();
      this.$emit('select', item);
    },
  },
  render() {
    return (
      <ul class='dropdown'>
        {this.items.map((item, index) =>
          (
            <li
              class={{'menu-item': true, 'menu-item--selected': this.selectedIndex === index}}
              key={item.id}
              onMousedown={this.handleMousedown.bind(this, item)}
            >
              {item.text}
            </li>
          )
        )}
      </ul>
    );
  },
};
</script>

<style lang="sass" scoped>
.dropdown
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

.menu-item
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  padding: 0.4em 0.8em
  cursor: pointer

  & + .menu-item
    border-top: 1px solid var(--border-color)

  &:hover
    background-color: rgba(0, 0, 0, 0.06)

.menu-item--selected
  background-color: rgba(#54bf8e, 0.2)
  color: #54bf8e

</style>

