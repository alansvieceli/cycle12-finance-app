import { fireEvent, render, screen } from '@testing-library/react-native';

import { ActionButton } from './ActionButton';

describe('ActionButton', () => {
  it('renders the label', () => {
    render(<ActionButton label="Salvar" onPress={jest.fn()} />);

    expect(screen.getByText('Salvar')).toBeOnTheScreen();
  });

  it('does not fire when disabled', () => {
    const onPress = jest.fn();

    render(<ActionButton disabled label="Continuar" onPress={onPress} />);
    fireEvent.press(screen.getByText('Continuar'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
