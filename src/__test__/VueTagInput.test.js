import { mount, } from 'vue-test-utils';
import VueTagInput from '@/VueTagInput';

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(VueTagInput, {
      propsData: {
        tags: [],
      },
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  // it('has the expected html structure', () => {
  //   const wrapper = mount(VueTagInput);
  //   expect(wrapper.element).toMatchSnapshot();
  // });
});
