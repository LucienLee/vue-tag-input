<script>
export default {
  name: 'TagInputTag',
  functional: true,
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  render(h, { props, listeners }) {
    const { item, index } = props;
    return (
      <div
        class='TagInput-tag'
        name={`tag-${index}`}
        key={item.id}
      >
        <span class='TagInput-tagText'>{item.text}</span>
        <span
          class='TagInput-tagRemoval'
          onClick={listeners.delete}
        />
      </div>
    );
  }
};
</script>

<style lang="sass">
@import './sass/utils'
$color: #909399

.TagInput-tag
  display: inline-flex
  align-items: center
  white-space: nowrap
  font-size: var(--font-size)
  padding: 0.25em 0.75em
  @extend %gap

  border-radius: 3px
  border: 1px solid rgba($color, 0.5)
  background: whitesmoke
  color: $color

.TagInput-tagRemoval
  position: relative
  width: 1.25em
  height: 1.25em
  cursor: pointer
  border-radius: 50%
  margin-right: -0.25em
  margin-left: 0.25em

  &:hover
    background-color: $color

    &::before,
    &::after
      background-color: #fff

  &::before,
  &::after
    content: ""
    position: absolute
    display: block
    top: 50%
    left: 50%
    height: 50%
    width: 2px
    transform-origin: center center
    background-color: currentColor

  &::before
    transform: translateX(-50%) translateY(-50%) rotate(-45deg)

  &::after
    transform: translateX(-50%) translateY(-50%) rotate(45deg)

</style>

