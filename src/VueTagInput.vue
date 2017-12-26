<script>
import stringWidth from 'string-width';
import TagInputSuggestions from '@/Suggestions';
import TagInputTag from '@/Tag';
import playOnce from '@/utils/playOnce';
import EVENTS from '@/utils/events';

const KEYS = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  UP: 38,
  DOWN: 40,
};

export default {
  name: "VueTagInput",
  componets: {
    TagInputSuggestions,
    TagInputTag,
  },
  model: {
    prop: 'tags',
    event: 'change',
  },
  props: {
    tags: {
      type: [Array, String],
      required: true,
      validator(array) {
        return array.reduce((acc, item) =>
          acc && (typeof item === 'string' || (item.id && item.text)), true);
      },
    },
    suggestions: {
      type: [Array, String],
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
        return [KEYS.ENTER, KEYS.TAB];
      },
    },
    delimiterChars: {
      type: Array,
      required: false,
      default() {
        return [',', '、'];
      },
    },
    quickMode: {
      type: Boolean,
      required: false,
      default: false,
    },
    onlyFromSuggestions: {
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
    borderColor: {
      type: String,
      required: false,
      default: '#e1e1e1',
    },
    errorAninmatedClass: {
      type: String,
      required: false,
      default: 'error',
    },
    tagStyle: {
      type: [Function, Object],
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      query: '',
      isComposing: false,
      focused: false,
      selectedIndex: 1,
    };
  },
  computed: {
    normalizedTags() {
      return this.normalizeData(this.tags);
    },
    flatTags() {
      return this.normalizedTags.map(tag => tag.text);
    },
    normalizedSuggestions() {
      return this.normalizeData(this.suggestions);
    },
    showDropdown() {
      return this.suggestions.length > 0 && this.query.length > 0;
    },
    cssVaribles() {
      return {
        '--gap': this.gap,
        '--font-size': this.fontSize,
        '--border-color': this.borderColor,
      };
    },
  },
  methods: {
    normalizeData(value) {
      return value.map((item, index) => {
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
    handleInput(e) {
      if (this.delimiterChars.indexOf(e.data) === -1) {
        this.query = e.target.value;
        this.$emit(EVENTS.INPUTCHANGE, e.target.value);
      } else {
        const regex = new RegExp(this.delimiterChars.join('|'), 'gi');
        this.$nextTick(() => {
          this.$refs.input.value = this.$refs.input.value.replace(regex, '');
        });
        this.addTag(this.query.trim());
      }
    },
    handleClick(e) {
      if (document.activeElement !== e.target) {
        this.$refs.input.focus();
      }
    },
    handleFocus() {
      this.focused = true;
      this.$emit(EVENTS.FOCUS);
    },
    handleBlur() {
      if (this.addOnBlur) {
        this.isComposing = false;
        this.addTag(this.query);
      }
      this.focused = false;
      this.$emit(EVENTS.BLUR);
    },
    handleKeydown(e) {
      this.isComposing = e.isComposing;

      if (e.keyCode === KEYS.BACKSPACE && this.$refs.input.selectionStart === 0) {
        this.deleteTag(this.tags.length - 1);
      }

      if (e.keyCode === KEYS.TAB || e.keyCode === KEYS.UP || e.keyCode === KEYS.DOWN) {
        e.preventDefault();
      }
    },
    handleKeyup(e) {
      let { showDropdown, selectedIndex, normalizedSuggestions } = this;
      // Handle selecting in autocomplete
      if (showDropdown) {
        if (e.keyCode === KEYS.UP) {
          selectedIndex -= 1;
        } else if (e.keyCode === KEYS.DOWN) {
          selectedIndex += 1;
        }
      }

      // Handle delimiters entering
      if (this.delimiters.indexOf(e.keyCode) !== -1 ) {
        const tag = selectedIndex !== -1 ? normalizedSuggestions[selectedIndex] : this.query.trim();
        this.addTag(tag);
      }
    },
    handleSelectFromSuggestions(item) {
      this.addTag(item);
    },
    addTag(input) {
      const tag = typeof input === 'string' ? input : input.text;
      if (tag === '' || this.isComposing) return;

      // Handle meeting duplicated tag
      const duplicatedIdx = this.flatTags.indexOf(tag);
      if (!this.allowDuplicated && duplicatedIdx !== -1 ) {
        return playOnce(this.$el.querySelector(`[name=tag-${duplicatedIdx}]`), this.errorAninmatedClass);
      }

      // Add tag
      this.query = '';
      this.selectedIndex = -1;
      if (this.quickMode) {
        this.$emit(EVENTS.CHANGE, [...this.tags, tag]);
      } else {
        this.$emit(EVENTS.ADD, tag);
      }
    },
    deleteTag(index) {
      if (this.quickMode) {
        this.$emit(EVENTS.CHANGE, [
          ...this.tags.slice(0, index),
          ...this.tags.slice(index + 1, this.tags.length),
        ]);
      } else {
        this.$emit(EVENTS.DELETE, index);
      }
    },
  },
  render() {
    return (
      <div
        class={['TagInput', {'is-focused': this.focused}]}
        style={this.cssVaribles}
        onClick={this.handleClick}
      >
        {this.normalizedTags.map((item, index) =>
          <TagInputTag
            item={item}
            tagStyle={typeof this.tagStyle === 'function' ? this.tagStyle(item) : this.tagStyle}
            onDelete={this.deleteTag.bind(this, index)}
          />,
        )}
        <div
          class="TagInput-search"
          ref="search"
          style={{'min-width': `${stringWidth(this.placeholder)}em`}}
        >
          <input
            class='TagInput-input'
            type='text'
            ref='input'
            value={this.query}
            placeholder={this.placeholder}
            onInput={this.handleInput}
            onKeyup={this.handleKeyup}
            onKeydown={this.handleKeydown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {this.showDropdown ?
            <TagInputSuggestions
              items={this.normalizedSuggestions}
              selectedIndex={this.selectedIndex}
              onSelect={this.handleSelectFromSuggestions}
            />
            : null}
        </div>
      </div>
    );
  },
};
</script>

<style lang="sass">
@import './sass/utils'
$color: #909399

.TagInput
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

.TagInput-search
  position: relative
  flex: 1
  max-width: 100%
  padding: var(--gap) 0
  font-size: var(--font-size)
  @extend %gap

.TagInput-input
  width: 100%
  border: 0
  padding: 0
  margin: 0
  outline: none
  font-size: inherit

@keyframes shake
  from, to
    transform: translate3d(0, 0, 0)

  20%, 60%
    transform: translate3d(-4px, 0, 0)

  40%, 80%
    transform: translate3d(4px, 0, 0)

.error
  animation-name: shake
  animation-fill-mode: both
  animation-duration: 0.25s

</style>

