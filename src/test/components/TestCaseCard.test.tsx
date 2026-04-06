import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TestCaseCard } from '@/components/ui/TestCaseCard';
import type { TestCase } from '@/types';

const pendingTestCase: TestCase = {
  id: 'tc1',
  title: 'Test Case 1: Basic deposit and withdrawal',
  expected: '1300',
  got: '—',
  status: 'pending',
};

const passTestCase: TestCase = {
  id: 'tc2',
  title: 'Test Case 2: Pass scenario',
  expected: '42',
  got: '42',
  status: 'pass',
};

const failTestCase: TestCase = {
  id: 'tc3',
  title: 'Test Case 3: Fail scenario',
  expected: '100',
  got: '0',
  status: 'fail',
};

describe('TestCaseCard', () => {
  it('renders the test case title', () => {
    render(<TestCaseCard testCase={pendingTestCase} />);
    expect(screen.getByText('Test Case 1: Basic deposit and withdrawal')).toBeInTheDocument();
  });

  it('renders the "Expected:" label', () => {
    render(<TestCaseCard testCase={pendingTestCase} />);
    expect(screen.getByText(/Expected:/)).toBeInTheDocument();
  });

  it('renders the "Got:" label', () => {
    render(<TestCaseCard testCase={pendingTestCase} />);
    expect(screen.getByText(/Got:/)).toBeInTheDocument();
  });

  it('renders the expected value', () => {
    render(<TestCaseCard testCase={pendingTestCase} />);
    expect(screen.getByText('1300')).toBeInTheDocument();
  });

  it('renders the got value', () => {
    render(<TestCaseCard testCase={pendingTestCase} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders a StatusIcon (SVG element)', () => {
    const { container } = render(<TestCaseCard testCase={pendingTestCase} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders correctly for a passing test case', () => {
    render(<TestCaseCard testCase={passTestCase} />);
    expect(screen.getByText('Test Case 2: Pass scenario')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders correctly for a failing test case', () => {
    render(<TestCaseCard testCase={failTestCase} />);
    expect(screen.getByText('Test Case 3: Fail scenario')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
