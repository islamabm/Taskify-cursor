import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';

// If you have a specific store for testing, import or create it here
// Otherwise, you can import your app's main store
import store from '../src/store/index';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
