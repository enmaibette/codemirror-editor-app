import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DescriptionTab } from '@/features/description-panel/DescriptionTab';
import type { Challenge } from '@/types';

const { MockShikiCodeBlock } = vi.hoisted(() => ({
  MockShikiCodeBlock: ({ code }: { code: string }) => <div data-testid="code-block">{code}</div>,
}));

vi.mock('@/features/description-panel/ShikiCodeBlock', () => ({
  ShikiCodeBlock: MockShikiCodeBlock,
}));

const descriptionMarkdown = [
  '## Description',
  '',
  'In this challenge, you will implement a basic `BankAccount` class.',
  '',
  '## Requirements',
  '',
  '- Create a class named `BankAccount`',
  '- Implement an `__init__` method that accepts an `owner` and `balance` parameter',
  '- Add a `deposit(amount)` method to add funds',
  '',
  '## Example',
  '',
  '```python',
  'account = BankAccount("Alice", 1000)',
  'account.deposit(500)',
  '```',
].join('\n');

const mockChallenge: Challenge = {
  id: '4',
  title: 'Create a Simple Bank Account Class',
  difficulty: 'Easy',
  descriptionMarkdown,
  starterCode: 'class BankAccount:\n    pass\n',
  hints: [],
  testCases: [],
};

describe('DescriptionTab', () => {
  it('renders the challenge title', () => {
    render(<DescriptionTab challenge={mockChallenge} />);
    expect(
      screen.getByRole('heading', { name: 'Create a Simple Bank Account Class', level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders a DifficultyBadge with the correct difficulty label', () => {
    render(<DescriptionTab challenge={mockChallenge} />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders the markdown description content', () => {
    render(<DescriptionTab challenge={mockChallenge} />);
    expect(screen.getByText((_, element) => element?.textContent === 'In this challenge, you will implement a basic BankAccount class.')).toBeInTheDocument();
  });

  it('renders markdown section headings', () => {
    render(<DescriptionTab challenge={mockChallenge} />);
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('renders requirement list items', () => {
    render(<DescriptionTab challenge={mockChallenge} />);
    expect(screen.getByText((_, element) => element?.textContent === 'Create a class named BankAccount')).toBeInTheDocument();
    expect(screen.getByText((_, element) => element?.textContent === 'Add a deposit(amount) method to add funds')).toBeInTheDocument();
  });

  it('renders fenced code blocks via ShikiCodeBlock', () => {
    render(<DescriptionTab challenge={mockChallenge} />);
    const codeBlock = screen.getByTestId('code-block');
    expect(codeBlock).toHaveTextContent('account = BankAccount("Alice", 1000)');
  });

  it('renders "Medium" badge for a Medium-difficulty challenge', () => {
    const mediumChallenge: Challenge = { ...mockChallenge, difficulty: 'Medium' };
    render(<DescriptionTab challenge={mediumChallenge} />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });
});
