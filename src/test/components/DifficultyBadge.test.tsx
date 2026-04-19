import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';

describe('DifficultyBadge', () => {
  it('renders "Easy" text', () => {
    render(<DifficultyBadge difficulty="Easy" />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders "Medium" text', () => {
    render(<DifficultyBadge difficulty="Medium" />);
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders "Hard" text', () => {
    render(<DifficultyBadge difficulty="Hard" />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('applies green color class for Easy', () => {
    const { container } = render(<DifficultyBadge difficulty="Easy" />);
    const badge = container.firstChild as HTMLElement;
    // The easy variant uses bg-(--success)
    expect(badge.className).toMatch(/success/);
  });

  it('applies yellow/orange color class for Medium', () => {
    const { container } = render(<DifficultyBadge difficulty="Medium" />);
    const badge = container.firstChild as HTMLElement;
    // The medium variant uses bg-(--warning)
    expect(badge.className).toMatch(/warning/);
  });

  it('applies red/destructive color class for Hard', () => {
    const { container } = render(<DifficultyBadge difficulty="Hard" />);
    const badge = container.firstChild as HTMLElement;
    // The hard variant uses bg-(--destructive)
    expect(badge.className).toMatch(/destructive/);
  });
});
