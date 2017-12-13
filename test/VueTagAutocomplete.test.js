import { mount, } from 'vue-test-utils';
import VueTagAutocomplete from '../src/VueTagAutocomplete';

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(VueTagAutocomplete);
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  it('has the expected html structure', () => {
    const wrapper = mount(VueTagAutocomplete);
    expect(wrapper.element).toMatchSnapshot();
  });
});
