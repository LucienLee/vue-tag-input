/* vue-test-utils has bug now, waiting for beta.9*/

import { mount } from 'vue-test-utils';
import keycode from 'keycode';
import VueTagInput from '@/VueTagInput';
import EVENTS from '@/utils/events';

const standardData = [
  {id: 1, text: 'Javascript', highlight: true},
  {id: 2, text: 'Typescript', highlight: false},
];

// const plainData = [
//   'Javascript',
//   'Typescript',
// ];

function createInstance(data = {}) {
  const defaults = {
    tags: [],
    suggestions: [],
  };

  return mount(VueTagInput, {
    propsData: Object.assign(defaults, data),
  });
}

function type(inputWrapper, value) {
  value.split('').forEach((char) => {
    key(inputWrapper, char);
    inputWrapper.element.value += char;
    // Vue calls onchange for every update to maintain state
    inputWrapper.trigger('input', { value: char });
  });
}

function key(inputWrapper, ...args) {
  args.forEach((value) => {
    inputWrapper.trigger('keydown', {
      which: keycode(value),
    });
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
    const query = 'hello world!';

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

  });


  describe('tag', () => {
    it('has customized style when having computed style function', () => {
      const wrapper = createInstance({
        tags: standardData,
        tagStyle(item) {
          if (item.highlight) return { backgroundColor: 'red' };
        },
      });

      expect(wrapper.find('[name^=tag]').hasStyle('background-color', 'red'));
    });
  });


  // it('has the expected html structure', () => {
  //   const wrapper = mount(VueTagInput);
  //   expect(wrapper.element).toMatchSnapshot();
  // });
});
