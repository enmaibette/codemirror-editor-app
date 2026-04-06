import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChallengeRow } from '@/components/ui/ChallengeRow';
import type { Challenge } from '@/types';

const mockChallenge: Challenge = {
  id: '1',
  title: 'Create a Class – Dog',
  difficulty: 'Easy',
  descriptionMarkdown: '## Description\n\nTest description',
  starterCode: '',
  hints: [],
  testCases: [],
};

describe('ChallengeRow', () => {
  it('renders the challenge title', () => {
    render(<ChallengeRow challenge={mockChallenge} onClick={vi.fn()} />);
    expect(screen.getByText('Create a Class – Dog')).toBeInTheDocument();
  });

  it('renders an ArrowRight icon (svg element present)', () => {
    const { container } = render(<ChallengeRow challenge={mockChallenge} onClick={vi.fn()} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls onClick with the correct challenge id when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<ChallengeRow challenge={mockChallenge} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith('1');
  });

  it('is rendered as a button element', () => {
    render(<ChallengeRow challenge={mockChallenge} onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('passes different challenge ids correctly to onClick', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const challenge4: Challenge = { ...mockChallenge, id: '4', title: 'BankAccount' };
    render(<ChallengeRow challenge={challenge4} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith('4');
  });
});
