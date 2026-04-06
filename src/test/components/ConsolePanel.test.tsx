import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConsolePanel } from '@/features/console/ConsolePanel';
import type { TestCase } from '@/types';

const mockTestCases: TestCase[] = [
  { id: 'tc1', title: 'Test Case 1', expected: '1300', got: '—', status: 'pending' },
  { id: 'tc2', title: 'Test Case 2', expected: 'No withdrawal', got: '—', status: 'pending' },
];

const defaultProps = {
  activeTab: 'output' as const,
  onTabChange: vi.fn(),
  outputLines: [],
  testCases: [],
  onClose: vi.fn(),
  onOpen: vi.fn(),
  isOpen: true,
};

describe('ConsolePanel', () => {
  it('renders an "Output" tab trigger', () => {
    render(<ConsolePanel {...defaultProps} />);
    expect(screen.getByText('Output')).toBeInTheDocument();
  });

  it('renders a "Test Cases" tab trigger', () => {
    render(<ConsolePanel {...defaultProps} />);
    expect(screen.getByText('Test Cases')).toBeInTheDocument();
  });

  it('shows output content when activeTab is "output"', () => {
    render(<ConsolePanel {...defaultProps} />);
    expect(screen.getByText(/Running code/)).toBeInTheDocument();
  });

  it('shows test case content when activeTab is "testcases"', () => {
    render(<ConsolePanel {...defaultProps} activeTab="testcases" testCases={mockTestCases} />);
    expect(screen.getByText('Test Case 1')).toBeInTheDocument();
    expect(screen.getByText('Test Case 2')).toBeInTheDocument();
  });

  it('calls onTabChange with "testcases" when Test Cases tab is clicked', async () => {
    const user = userEvent.setup();
    const handleTabChange = vi.fn();
    render(<ConsolePanel {...defaultProps} onTabChange={handleTabChange} testCases={mockTestCases} />);
    await user.click(screen.getByText('Test Cases'));
    expect(handleTabChange).toHaveBeenCalledWith('testcases');
  });

  it('calls onTabChange with "output" when Output tab is clicked', async () => {
    const user = userEvent.setup();
    const handleTabChange = vi.fn();
    render(<ConsolePanel {...defaultProps} activeTab="testcases" onTabChange={handleTabChange} testCases={mockTestCases} />);
    await user.click(screen.getByText('Output'));
    expect(handleTabChange).toHaveBeenCalledWith('output');
  });

  it('renders outputLines content when provided and activeTab is "output"', () => {
    render(
      <ConsolePanel
        {...defaultProps}
        outputLines={['> Running code...', '  class Dog:', '// Your output will appear here']}
      />
    );
    expect(screen.getByText(/class Dog:/)).toBeInTheDocument();
  });

  it('renders "No test cases" message when testCases is empty and tab is "testcases"', () => {
    render(<ConsolePanel {...defaultProps} activeTab="testcases" />);
    expect(screen.getByText(/No test cases defined/)).toBeInTheDocument();
  });

  it('hides content when isOpen is false', () => {
    render(<ConsolePanel {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(/Running code/)).not.toBeInTheDocument();
  });

  it('calls onOpen when a tab is clicked while closed', async () => {
    const user = userEvent.setup();
    const handleOpen = vi.fn();
    render(<ConsolePanel {...defaultProps} isOpen={false} onOpen={handleOpen} />);
    await user.click(screen.getByText('Test Cases'));
    expect(handleOpen).toHaveBeenCalled();
  });
});
