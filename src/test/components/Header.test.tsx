import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';

// Mock the useRunCode hook so we can assert triggerRun is called
const mockTriggerRun = vi.fn();
vi.mock('@/hooks/useRunCode', () => ({
  useRunCode: () => ({ triggerRun: mockTriggerRun }),
}));

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location-path">{location.pathname}</div>;
}

function renderHeader(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LocationDisplay />
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/challenge/:id" element={<Header />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  useChallengeStore.setState({
    challenges: [],
    activeChallengeId: null,
    editorContent: '',
  });
  useUIStore.setState({
    isLeftPanelOpen: true,
    consoleActiveTab: 'output',
    descriptionActiveTab: 'description',
    outputLines: [],
  });
});

describe('Header', () => {
  it('renders the logo text "</> PyOOP Learn"', () => {
    renderHeader();
    expect(screen.getByText(/PyOOP Learn/)).toBeInTheDocument();
  });

  it('renders logo and Python OOP as links to landing page', () => {
    renderHeader('/challenge/1');
    expect(screen.getByRole('link', { name: /pyoop learn/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /python oop/i })).toHaveAttribute('href', '/');
  });

  it('renders a "Run" button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /run/i })).toBeInTheDocument();
  });

  it('renders a "Submit" button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('Run button has the outline variant (border class applied)', () => {
    renderHeader();
    const runButton = screen.getByRole('button', { name: /run/i });
    // The shadcn outline variant adds a border class
    expect(runButton.className).toMatch(/border/);
  });

  it('clicking Run calls triggerRun', async () => {
    const user = userEvent.setup();
    renderHeader();
    await user.click(screen.getByRole('button', { name: /run/i }));
    expect(mockTriggerRun).toHaveBeenCalledTimes(1);
  });

  it('shows "Python OOP" in breadcrumb on the home route', () => {
    renderHeader('/');
    expect(screen.getByText('Python OOP')).toBeInTheDocument();
  });

  it('shows the route-based challenge breadcrumb on a challenge route', () => {
    renderHeader('/challenge/1');
    expect(screen.getByText('Challenge 1')).toBeInTheDocument();
  });

  it('does not show "Challenge N" breadcrumb on the home route', () => {
    renderHeader('/');
    expect(screen.queryByText(/Challenge \d/)).not.toBeInTheDocument();
  });

  it('navigates to landing page when logo is clicked', async () => {
    const user = userEvent.setup();
    renderHeader('/challenge/1');

    await user.click(screen.getByRole('link', { name: /pyoop learn/i }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/');
  });

  it('navigates to landing page when Python OOP breadcrumb is clicked', async () => {
    const user = userEvent.setup();
    renderHeader('/challenge/1');

    await user.click(screen.getByRole('link', { name: /python oop/i }));

    expect(screen.getByTestId('location-path')).toHaveTextContent('/');
  });
});
