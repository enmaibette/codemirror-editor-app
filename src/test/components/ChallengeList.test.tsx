import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ChallengeList } from '@/features/challenge-list/ChallengeList';
import { useChallengeStore } from '@/stores/challengeStore';
import { challenges as staticChallenges } from '@/data/challenges';

// Reset to real challenges before each test
beforeEach(() => {
  useChallengeStore.setState({
    challenges: staticChallenges,
    activeChallengeId: null,
    editorContent: '',
  });
});

function renderList() {
  return render(
    <MemoryRouter>
      <ChallengeList />
    </MemoryRouter>
  );
}

describe('ChallengeList', () => {
  it('renders the correct number of challenge rows (4)', () => {
    renderList();
    const rows = screen.getAllByRole('button');
    expect(rows).toHaveLength(4);
  });

  it('renders all challenge titles', () => {
    renderList();
    expect(screen.getByText('Create a Class – Dog')).toBeInTheDocument();
    expect(screen.getByText('Methode – Add a Method to the Dog class')).toBeInTheDocument();
    expect(screen.getByText('Inheritance')).toBeInTheDocument();
    expect(screen.getByText('Create a Simple Bank Account Class')).toBeInTheDocument();
  });

  it('each row is clickable', async () => {
    const user = userEvent.setup();
    renderList();
    const rows = screen.getAllByRole('button');
    for (const row of rows) {
      // Should not throw when clicked
      await user.click(row);
    }
  });

  it('navigates when a challenge row is clicked (no crash)', async () => {
    const user = userEvent.setup();
    renderList();
    const firstRow = screen.getAllByRole('button')[0];
    await expect(user.click(firstRow)).resolves.not.toThrow();
  });
});
