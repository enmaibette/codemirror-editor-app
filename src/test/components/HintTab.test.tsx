import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HintTab } from '@/features/description-panel/HintTab';
import type { Hint } from '@/types';

const twoHints: Hint[] = [
  { id: 'h1', text: 'Use self.name = name inside __init__.' },
  { id: 'h2', text: 'Remember that __init__ is the constructor.' },
];

const threeHints: Hint[] = [
  { id: 'h1', text: 'First hint text here.' },
  { id: 'h2', text: 'Second hint text here.' },
  { id: 'h3', text: 'Third hint text here.' },
];

describe('HintTab', () => {
  it('renders the correct number of accordion triggers for 2 hints', () => {
    render(<HintTab hints={twoHints} />);
    expect(screen.getByText('Hint 1')).toBeInTheDocument();
    expect(screen.getByText('Hint 2')).toBeInTheDocument();
  });

  it('renders the correct number of accordion triggers for 3 hints', () => {
    render(<HintTab hints={threeHints} />);
    expect(screen.getByText('Hint 1')).toBeInTheDocument();
    expect(screen.getByText('Hint 2')).toBeInTheDocument();
    expect(screen.getByText('Hint 3')).toBeInTheDocument();
  });

  it('hints are collapsed by default (content not visible before click)', () => {
    render(<HintTab hints={twoHints} />);
    // AccordionContent is hidden by default via data-state=closed
    // The text may still be in the DOM but the container has hidden state
    const hint1Button = screen.getByText('Hint 1').closest('button');
    expect(hint1Button).toHaveAttribute('data-state', 'closed');
  });

  it('expands and shows hint text when accordion trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<HintTab hints={twoHints} />);

    await user.click(screen.getByText('Hint 1'));

    // After click the trigger should be open
    const trigger = screen.getByText('Hint 1').closest('button');
    expect(trigger).toHaveAttribute('data-state', 'open');
  });

  it('hint text is accessible in the DOM after expansion', async () => {
    const user = userEvent.setup();
    render(<HintTab hints={twoHints} />);

    await user.click(screen.getByText('Hint 1'));

    expect(
      screen.getByText('Use self.name = name inside __init__.')
    ).toBeInTheDocument();
  });

  it('shows "No hints available" message when hints array is empty', () => {
    render(<HintTab hints={[]} />);
    expect(screen.getByText(/No hints available/)).toBeInTheDocument();
  });

  it('multiple accordion items can be opened independently (type=multiple)', async () => {
    const user = userEvent.setup();
    render(<HintTab hints={twoHints} />);

    await user.click(screen.getByText('Hint 1'));
    await user.click(screen.getByText('Hint 2'));

    const trigger1 = screen.getByText('Hint 1').closest('button');
    const trigger2 = screen.getByText('Hint 2').closest('button');
    expect(trigger1).toHaveAttribute('data-state', 'open');
    expect(trigger2).toHaveAttribute('data-state', 'open');
  });
});
