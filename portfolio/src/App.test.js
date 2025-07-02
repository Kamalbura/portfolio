import { render } from '@testing-library/react';
import App from './App';

test('renders without crashing', () => {
  // Just check if it renders without crashing
  const { container } = render(<App />);
  expect(container).toBeDefined();
});
