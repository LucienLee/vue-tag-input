import { mount } from 'vue-test-utils';
import keycode from 'keycode';
import VueTagInput from '@/VueTagInput';
import TagInputTag from '@/Tag';
import EVENTS from '@/constants/events';


const plainTags = [
  'Javascript',
  'Typescript',
];

const standardTags = plainTags.map((tag, index) => ({id: index, text: tag}));
const customizedTags = standardTags.map((item, index) => ({
  ...item,
  highlight: !!index,
}));


function createInstance(props = {}) {
  const defaultProps = {
    tags: [],
    suggestions: [],
  };

  return mount(VueTagInput, {
    propsData: Object.assign(defaultProps, props),
  });
}

function type(inputWrapper, value) {
  value.split('').forEach((char) => {
    key(inputWrapper, char);
    inputWrapper.element.value += char;
    inputWrapper.element.selectionStart += 1;
    // Vue calls onchange for every update to maintain state
    inputWrapper.trigger('input', { data: char });
  });
}

function key(inputWrapper, ...args) {
  args.forEach((value) => {
    const payload = {
      which: keycode(value),
      keyCode: keycode(value),
      key: value,
    };
    inputWrapper.trigger('keydown', payload);
    inputWrapper.trigger('keyup', payload);
  });
}

describe('Tag Input', () => {
  it('is a Vue instance', () => {
    const wrapper = createInstance();
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe('input', () => {
    it('assigns the given placeholder', () => {
      const wrapper = createInstance({ placeholder: 'Please enter a tag' });
      expect(wrapper.find({ref: 'input'}).element.placeholder).toEqual('Please enter a tag');
    });

    it('assigns min width to fit placeholder', () => {
      const placeholder = ['Please enter', '一個標籤'];
      const wrapper = createInstance({ placeholder: placeholder.join(' ') });
      expect(wrapper.find({ref: 'search'}).hasStyle('min-width',
        `${placeholder[0].length + placeholder[1].length * 2 + 1}em`)).toBe(true);
    });

    it('decorates the component root when focused', () => {
      const wrapper = createInstance();
      const inputWrapper = wrapper.find({ref: 'input'});

      inputWrapper.trigger(EVENTS.FOCUS);
      expect(wrapper.classes()).toContain('is-focused');

      inputWrapper.trigger(EVENTS.BLUR);
      expect(wrapper.classes()).not.toContain('is-focused');
    });

    it('emits focus or blur event when focus status changed', () => {
      const wrapper = createInstance();
      const inputWrapper = wrapper.find({ref: 'input'});

      inputWrapper.trigger(EVENTS.FOCUS);
      expect(wrapper.emitted()[EVENTS.FOCUS]).toBeTruthy();

      inputWrapper.trigger(EVENTS.BLUR);
      expect(wrapper.emitted()[EVENTS.BLUR]).toBeTruthy();
    });

  });

  describe('query', () => {
    const query = 'Javascript';

    it('updates the internal state', () => {
      const wrapper = createInstance();
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, query);
      expect(wrapper.vm.query).toEqual(query);
    });

    it('triggers the input change event', () => {
      const wrapper = createInstance();
      const inputWrapper = wrapper.find({ref: 'input'});
      type(inputWrapper, query);

      expect(wrapper.emitted()[EVENTS.INPUTCHANGE].length).toBe(query.length);
    });

    it('adds a tag when input blurs', () => {
      const wrapper = createInstance({ addOnBlur: true });
      const inputWrapper = wrapper.find({ref: 'input'});

      inputWrapper.trigger(EVENTS.FOCUS);
      type(inputWrapper, query);
      inputWrapper.trigger(EVENTS.BLUR);

      expect(wrapper.emitted()[EVENTS.ADD]).toBeTruthy();
      expect(wrapper.emitted()[EVENTS.ADD][0]).toEqual([query]);
    });

    it('can allow new, non-suggested tags to be added', () => {
      const wrapper = createInstance({ onlyFromSuggestions: false });
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, query);
      key(inputWrapper, 'enter');

      expect(wrapper.emitted()[EVENTS.ADD]).toBeTruthy();
    });

    it('can prohibit non-suggested tags to be added', () => {
      const wrapper = createInstance({ onlyFromSuggestions: true });
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, query);
      key(inputWrapper, 'enter');

      expect(wrapper.emitted()[EVENTS.ADD]).toBeFalsy();
    });

    it('can add new tags when a delimiter character is entered', () => {
      const wrapper = createInstance({
        delimiterChars: [',', ';', '、'],
      });
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, 'foo,bar;baz、qux');
      key(inputWrapper, 'enter');

      expect(wrapper.emitted()[EVENTS.ADD].length).toBe(4);
      expect(wrapper.emitted()[EVENTS.ADD]).toEqual([['foo'], ['bar'], ['baz'], ['qux']]);
    });

    it('can add duplicates', () => {
      const wrapper = createInstance({
        tags: standardTags,
        allowDuplicates: true,
      });
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, query);
      key(inputWrapper, 'enter');

      expect(wrapper.emitted()[EVENTS.ADD][0]).toEqual([query]);
    });

    it('does not add duplicates and hints by styling the tag', () => {
      const errorClass = 'customClass';
      const duplicatedID = standardTags.filter(tag => tag.text === query)[0].id;
      const wrapper = createInstance({
        tags: standardTags,
        allowDuplicates: false,
        errorAninmatedClass: errorClass,
      });
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, query);
      key(inputWrapper, 'enter');

      expect(wrapper.emitted()[EVENTS.ADD]).toBeFalsy();
      expect(wrapper.find(`[data-id="${duplicatedID}"]`).classes()).toContain(errorClass);
    });
  });


  describe('tag', () => {
    it('has customized style when having computed style function', () => {
      const wrapper = createInstance({
        tags: customizedTags,
        tagStyle(item) {
          if (item.highlight) return { backgroundColor: 'red' };
        },
      });
      const tags = wrapper.findAll(TagInputTag);
      expect(tags.at(0).hasStyle('background-color', 'red')).toBeFalsy();
      expect(tags.at(1).hasStyle('background-color', 'red')).toBeTruthy();
    });

    it('deletes the last selected tag when backspace is pressed and query is empty', () => {
      const wrapper = createInstance({tags: standardTags});
      const inputWrapper = wrapper.find({ref: 'input'});
      type(inputWrapper, '');
      key(inputWrapper, 'backspace');

      expect(wrapper.emitted()[EVENTS.DELETE]).toBeTruthy();
      expect(wrapper.emitted()[EVENTS.DELETE][0]).toEqual([wrapper.vm.$props.tags.length - 1]);
    });

    it('does not delete the last selected tag when backspace is pressed and selection is not at the beginning', () => {
      const wrapper = createInstance({tags: standardTags});
      const inputWrapper = wrapper.find({ref: 'input'});

      type(inputWrapper, 'hello');
      key(inputWrapper, 'backspace');
      expect(wrapper.emitted()[EVENTS.DELETE]).toBeFalsy();
    });

  });

  // it('has the expected html structure', () => {
  //   const wrapper = mount(VueTagInput);
  //   expect(wrapper.element).toMatchSnapshot();
  // });
});
