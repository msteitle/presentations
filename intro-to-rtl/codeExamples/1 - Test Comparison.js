import React from 'react';
import { mountWithTheme, ThemeProvider } from 'shield/utils';
import { shallow } from 'enzyme';
import { render, screen, fireEvent } from '@testing-library/react';

/**
 * This example is based on an existing test of production code in Jupiter.
 */

describe('AppsPage', () => {
  describe('Enzyme', () => {
    function getFilter(wrapper) {
      return wrapper.find(RcAutoSizer)
        .shallow()
        .find(Observer)
        .shallow()
        .find(JuiConversationPageHeader)
        .shallow()
        .find(JuiPhoneFilter)
        .shallow();
    }
  
    function getHeader(wrapper) {
      return wrapper.find(RcAutoSizer)
        .shallow()
        .find(Observer)
        .shallow()
        .find(JuiConversationPageHeader);
    }

    it('displays the filter and header when the button it clicked', async () => {
      const wrapper = shallow(<AppsPage {...props} />);
      const button = wrapper.find(SomeSpecialButton);
      
      await button.simulate('click');
      wrapper.update();
    
      const filter = getFilter(wrapper);
      const header = getHeader(wrapper);
      expect(filter.props().InputProps.placeholder).toBe('Filter apps');
      expect(header.props().mainTitle).toBe('Discover apps');
    });
    
    // What happens if I change the name of one of the components? JuiPhoneFilter, JuiConversationPageHeader, RcAutoSizer, SomeSpecialButton?
    // What if I no longer need to wrap these components in the Observer component, or the RcAutoSizer component? Or the DOM structure changed?
    // How about the name of the props passed to the header or filter components?
    // What if the way JuiPhoneFilter or JuiConversationPageHeader utilized the props changes, or breaks?
    // What are we -actally- testing here? Is it meaningful?
  });
  
  describe('React Testing Library', () => {
    it('displays the filter and header when the button it clicked', async () => {
      render(
        <ThemeProvider>
          <AppsPage {...props} />
        </ThemeProvider>,
      );
      fireEvent.click(screen.getByText('common.download'));
    
    //   // Selecting and asserting content at the same time!
    expect(await screen.findByPlaceholderText('Filter apps')).toBeInTheDocument(); // string, good
    expect(await screen.findByText(/discover apps/i)).toBeInTheDocument(); // regexp, also good, more flexibility
    //   // or, if you need more precision
      expect((await screen.findByRole('textbox')).placeholder).toBe('Filter apps');
      expect((await screen.findByRole('heading')).textContent).toBe('Discover apps');
    //   // querying by testId is an escape hatch:
    //   // It also exposes a recommended way to find elements by a data-testid as an "escape hatch" for elements where the text content and label do not make sense or is not practical.
    //   // RTL in our environment is configured with this test-id attribute mapped to our data-test-automation-id attribute
      expect((await screen.findByTestId('apps-page-filter')).placeholder).toBe('Filter apps');
      expect((await screen.findByTestId('apps-page-header')).textContent).toBe('Discover apps');
    //   // or, if you really must
      expect((await screen.findByPlaceholderText(/filter apps/i, { selector: 'input' })));
      expect((await screen.findByText('Discover apps', { selector: 'header' })));

    //   // there are many ways to do it, including:
      expect(document.querySelector('input').placeholder).toBe('Filter apps');
      expect(document.querySelector('header').textContent).toBe('Discover apps');
      
    //   // because they're just DOM Nodes -- BUT, the closer you get to the implementation details, the less resilient it is
    // });

    // Same questions as above.
  });
});