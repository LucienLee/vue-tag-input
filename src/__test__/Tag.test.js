import { mount } from 'vue-test-utils';
import TagInputTag from '@/Tag';

describe('Tag', () => {
  let tagWrapper;
  let mockDelete;

  beforeEach(() => {
    mockDelete = jest.fn();
    tagWrapper = mount(TagInputTag, {
      context: {
        props: {
          item: {
            id: 1,
            text: 'Yo',
          },
          tagStyle: {
            color: '#fff',
          },
        },
        listeners: {
          delete: mockDelete,
        },
      },
    });
  });

  it('has the expected html structure', () => {
    expect(tagWrapper.html()).toMatchSnapshot();
  });

  it('triggers parent listners when click removal button', () => {
    tagWrapper.find('.TagInput-tagRemoval').trigger('click');
    expect(mockDelete.mock.calls).toBeTruthy();
  });
});
