<script>
import stringWidth from 'string-width';
import TagInputSuggestions from '@/Suggestions';
import TagInputTag from '@/Tag';
import playOnce from '@/utils/playOnce';
import stepByNumberRange from '@/utils/stepByNumberRange';
import EVENTS from '@/constants/events';
import KEYS from '@/constants/keys';

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
      default: 'Add new tags',
    },
    id: {
      type: String,
      required: false,
      default: '',
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
    allowDuplicates: {
      type: Boolean,
      required: false,
      default: false,
    },
    addOnBlur: {
      type: Boolean,
      required: false,
      default: false,
    },
    maxSuggestionsLength: {
      type: Number,
      required: false,
      default: Infinity,
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
    preventDefaultOnEnter: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      query: '',
      originalQuery: '',
      isComposing: false,
      isJustComposed: false,
      focused: false,
      selectedIndex: this.initSelectedIndex,
      isLoading: false,
    };
  },
  computed: {
    initSelectedIndex() {
      return this.onlyFromSuggestions ? 0 : -1;
    },
    normalizedTags() {
      return this.normalizeData(this.tags);
    },
    normalizedSuggestions() {
      return this.normalizeData(this.suggestions);
    },
    filteredSuggestions() {
      const {originalQuery, maxSuggestionsLength, normalizedSuggestions, normalizedTags, allowDuplicates} = this;
      const regex = new RegExp(`${this.escapeForRegExp(originalQuery)}`, 'i');
      return normalizedSuggestions
        .filter((item) => {
          return regex.test(item.text)
            // filter entered tags if not allow duplicated
            && (allowDuplicates || !normalizedTags.find(tag => tag.text === item.text));
        })
        .slice(0, maxSuggestionsLength);
    },
    showSuggestions() {
      return this.filteredSuggestions.length > 0
        && this.query.length > 0
        && !this.isLoading
        && !this.isComposing;
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
    escapeForRegExp(query) {
      return query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    normalizeData(value) {
      return value.map((item, index) => typeof item === 'string'
        ? {id: `${index}${item}`, text: item}
        : item);
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
    handleSelectFromSuggestions(item) {
      this.addTag(item);
    },
    // Event sequence: keydown -> compositionstart -> input -> compositionend -> keyup
    handleKeydown(e) {
      // delete tag if key backspace at the start of input
      if (e.keyCode === KEYS.BACKSPACE && this.$refs.input.selectionStart === 0) {
        this.deleteTag(this.tags.length - 1);
      }

      // prevent arrow key to keep cursor position in input
      if (e.keyCode === KEYS.TAB || e.keyCode === KEYS.UP || e.keyCode === KEYS.DOWN) {
        e.preventDefault();
      }

      // prevent ENTER key to keep cursor position in input
      if (e.keyCode === KEYS.ENTER && this.preventDefaultOnEnter) {
        e.preventDefault();
      }
    },
    handleComposition(e) {
      if (e.type === 'compositionend') {
        this.isComposing = false;
        this.isJustComposed = true;
        this.handleInput(e);
      } else {
        this.isComposing = true;
      }
    },
    handleInput(e) {
      if (this.isComposing) return;
      if (this.delimiterChars.indexOf(e.data) === -1) {
        this.query = e.target.value;
        this.originalQuery = e.target.value;
        this.selectedIndex = this.initSelectedIndex;
        this.$emit(EVENTS.INPUTCHANGE, e.target.value);
      } else {
        const regex = new RegExp(this.delimiterChars.join('|'), 'gi');
        this.$nextTick(() => {
          this.$refs.input.value = this.$refs.input.value.replace(regex, '');
        });

        const tag = this.selectedIndex !== -1 ? this.filteredSuggestions[this.selectedIndex] : this.query.trim();
        if (tag) {
          this.addTag(tag);
        }
      }
    },
    handleKeyup(e) {
      const { showSuggestions, delimiters, filteredSuggestions, initSelectedIndex } = this;

      // Handle selecting in autocomplete
      if (showSuggestions) {
        if (e.keyCode === KEYS.UP || e.keyCode === KEYS.DOWN) {
          const difference = e.keyCode === KEYS.UP ? -1 : 1;
          this.selectedIndex = stepByNumberRange(this.selectedIndex, difference, initSelectedIndex, this.filteredSuggestions.length - 1);
          this.query = this.selectedIndex === -1 ? this.originalQuery: filteredSuggestions[this.selectedIndex].text;
        }
      }

      // Handle delimiters entering
      if (delimiters.indexOf(e.keyCode) !== -1 && !this.isJustComposed) {
        const tag = this.selectedIndex !== -1 ? filteredSuggestions[this.selectedIndex] : this.query.trim();
        if (tag) {
          this.addTag(tag);
        }
      }
      if (this.isJustComposed) {
        this.isJustComposed = false;
      }
    },
    addTag(input) {
      const text = typeof input === 'string' ? input : input.text;
      if (text === '') return;

      // Handle duplicates
      const duplicate = this.normalizedTags.find(tag => tag.text === text);
      if (!this.allowDuplicates && duplicate) {
        return playOnce(this.$el.querySelector(`[data-id="${duplicate.id}"]`), this.errorAninmatedClass);
      }

      // Add tag
      this.query = '';
      this.originalQuery = '';
      this.selectedIndex = this.initSelectedIndex;
      if (this.quickMode) {
        this.$emit(EVENTS.CHANGE, [...this.tags, input]);
      } else {
        this.$emit(EVENTS.ADD, input);
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
            class="TagInput-input"
            type="text"
            autocomplete="off"
            ref="input"
            id={this.id}
            value={this.query}
            placeholder={this.placeholder}
            onKeyup={this.handleKeyup}
            onCompositionstart={this.handleComposition}
            onInput={this.handleInput}
            onCompositionend={this.handleComposition}
            onKeydown={this.handleKeydown}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {this.showSuggestions ?
            <TagInputSuggestions
              query={this.query}
              suggestions={this.filteredSuggestions}
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

// TODO: Change to percentage?
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

