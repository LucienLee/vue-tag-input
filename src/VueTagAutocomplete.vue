<script>
const KEYS = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
};

const EVENTS = {
  INPUTCHANGE: 'inputChange',
  INPUT: 'input',
  ADD: 'add',
  DELETE: 'delete',
};

export default {
  name: "VueTagAutocomplete",
  props: {
    value: {
      type: [Array, String,],
      required: true,
      validator(array) {
        return array.reduce((acc, item) =>
          acc && (typeof item === 'string' || (item.id && item.text)), true);
      },
    },
    suggestions: {
      type: [Array, String,],
      required: false,
      default(){ return []; },
      validator(array) {
        return array.reduce((acc, item) =>
          acc && (typeof item === 'string' || (item.id && item.text)), true);
      },
    },
    placeholder: {
      type: String,
      required: false,
      default: "Add new tags",
    },
    delimiters: {
      type: Array,
      required: false,
      default() {
        return [KEYS.ENTER, KEYS.TAB,];
      },
    },
    delimiterChars: {
      type: Array,
      required: false,
      default() {
        return [',', '、',];
      },
    },
    quickMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowNew: {
      type: Boolean,
      required: false,
      default: false,
    },
    allowDuplicated: {
      type: Boolean,
      required: false,
      default: false,
    },
    addOnBlur: {
      type: Boolean,
      required: false,
      default: false,
    },
    /* Style Props */
    gap: {
      type: String,
      required: false,
      default: '0.4em',
    },
    fontSize: {
      type: String,
      required: false,
      default: '16px',
    },
  },
  data() {
    return {
      query: '',
      isComposing: false,
    };
  },
  computed: {
    tags() {
      return this.value.map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `${index}${item}`,
            text: item,
          };
        } else {
          return item;
        }
      });
    },
  },
  methods: {
    handleInput(e) {
      if (this.delimiterChars.indexOf(e.data) === -1) {
        this.query = e.target.value;
        this.$emit(EVENTS.INPUTCHANGE, e.data);
      } else {
        const regex = new RegExp(this.delimiterChars.join('|'), 'gi');
        this.$nextTick(() => {
          this.$refs.input.value = this.$refs.input.value.replace(regex, '');
        });
        this.addTag(this.query);
      }
    },
    handleClick() {
      this.$refs.input.focus();
    },
    handleBlur() {
      if (this.addOnBlur) {
        this.isComposing = false;
        this.addTag(this.query);
      }
    },
    handleKeydown(e) {
      this.isComposing = e.isComposing;

      if (e.keyCode === KEYS.BACKSPACE && this.$refs.input.selectionStart === 0) {
        this.deleteTag(this.value.length - 1);
      }

      if (e.keyCode === KEYS.TAB) {
        e.preventDefault();
      }
    },
    handleKeyup(e) {
      if (this.delimiters.indexOf(e.keyCode) !== -1 ) {
        this.addTag(this.query);
      }
    },
    addTag(text) {
      const tag = text.trim();
      if (tag === '' || this.isComposing) return;

      this.query = '';
      if (this.quickMode) {
        this.$emit(EVENTS.INPUT, [...this.value, tag,]);
      } else {
        this.$emit(EVENTS.ADD, tag);
      }
    },
    deleteTag(index) {
      if (this.quickMode) {
        this.$emit(EVENTS.INPUT, [
          ...this.value.slice(0, index),
          ...this.value.slice(index + 1, this.value.length),
        ]);
      } else {
        this.$emit(EVENTS.DELETE, index);
      }
    },
  },
  render() {
    return (
      <div class='TagsInput'
        style={{'--font-size': this.fontSize, '--gap': this.gap,}}
        onClick={this.handleClick}
      >
        {this.tags.map((item, index) =>
          (
            <div class='tag' key={item.id}>
              <span class='text'>{item.text}</span>
              <span class='delete'
                onClick={this.deleteTag.bind(this, index)}
              ></span>
            </div>
          )
        )}
        <input class='input' type='text'
          ref='input'
          value={this.query}
          placeholder={this.placeholder}
          onInput={this.handleInput}
          onKeyup={this.handleKeyup}
          onKeydown={this.handleKeydown}
          onBlur={this.handleBlur}
        />
      </div>
    );
  },
};
</script>

<style lang="sass" scoped>
$color: #909399

.TagsInput
  position: relative
  display: flex
  align-items: center
  flex-wrap: wrap
  justify-content: flex-start
  box-sizing: border-box
  width: 100%
  font-size: var(--font-size)
  padding-left: var(--gap)
  padding-bottom: var(--gap)
  cursor: text

  border: 1px solid $color
  border-radius: 4px
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075)

%gap
  margin-right: var(--gap)
  margin-top: var(--gap)

.input
  @extend %gap
  flex: 1
  max-width: 100%
  padding: var(--gap) 0
  border: 0
  outline: none
  font-size: var(--font-size)

.tag
  @extend %gap
  display: inline-flex
  align-items: center
  white-space: nowrap
  font-size: var(--font-size)
  padding: 0.25em 0.75em

  border-radius: 3px
  border: 1px solid rgba($color, 0.5)
  background: whitesmoke
  color: $color

.delete
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

