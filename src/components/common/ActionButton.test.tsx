import { render, screen } from '@testing-library/react-native';

import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renders the label', () => {
    render(<ActionButton label="Salvar" onPress={jest.fn()} />);

    expect(screen.getByText('Salvar')).toBeOnTheScreen();
  });
});
