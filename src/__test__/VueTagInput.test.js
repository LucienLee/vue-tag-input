/* vue-test-utils has bug now, waiting for beta.9*/

import { mount } from 'vue-test-utils';
import keycode from 'keycode';
import VueTagInput from '@/VueTagInput';

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
      which: keycode(value)
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

    it('assign min width to fit placeholder', () => {
      const placeholder = ['Please enter', '一個標籤'];
      const wrapper = createInstance({ placeholder: placeholder.join(' ') });
      expect(wrapper.find('.search').hasStyle('min-width',
        `${placeholder[0].length + placeholder[1].length * 2 + 1}em`)).toBe(true);
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

      expect(wrapper.emitted().inputChange.length).toBe(query.length);
    });


  });



  // it('has the expected html structure', () => {
  //   const wrapper = mount(VueTagInput);
  //   expect(wrapper.element).toMatchSnapshot();
  // });
});
