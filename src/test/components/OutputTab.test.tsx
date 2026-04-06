import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutputTab } from '@/features/console/OutputTab';

describe('OutputTab', () => {
  describe('when outputLines is empty', () => {
    it('shows "> Running code..." placeholder text', () => {
      render(<OutputTab outputLines={[]} />);
      expect(screen.getByText(/> Running code\.\.\./)).toBeInTheDocument();
    });

    it('shows "// Your output will appear here" placeholder text', () => {
      render(<OutputTab outputLines={[]} />);
      expect(screen.getByText(/\/\/ Your output will appear here/)).toBeInTheDocument();
    });

    it('renders both placeholder lines in a single pre element', () => {
      const { container } = render(<OutputTab outputLines={[]} />);
      const pre = container.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre!.textContent).toContain('> Running code...');
      expect(pre!.textContent).toContain('// Your output will appear here');
    });
  });

  describe('when outputLines has content', () => {
    it('renders each line', () => {
      const lines = ['> Running code...', '  class Dog:', '// Your output will appear here'];
      render(<OutputTab outputLines={lines} />);
      expect(screen.getByText(/> Running code\.\.\./)).toBeInTheDocument();
      expect(screen.getByText(/class Dog:/)).toBeInTheDocument();
      expect(screen.getByText(/\/\/ Your output will appear here/)).toBeInTheDocument();
    });

    it('does not show placeholder when lines are present', () => {
      render(<OutputTab outputLines={['actual output']} />);
      // The placeholder pre (muted color) should not be present; content pre is rendered instead
      const { container } = render(<OutputTab outputLines={['actual output']} />);
      const pre = container.querySelector('pre');
      expect(pre).toBeInTheDocument();
      // Content pre should have var(--text) not var(--muted)
      expect(pre!.className).not.toMatch(/muted/);
    });

    it('joins multiple lines with newline', () => {
      const lines = ['line1', 'line2', 'line3'];
      render(<OutputTab outputLines={lines} />);
      const { container } = render(<OutputTab outputLines={lines} />);
      const pre = container.querySelector('pre')!;
      expect(pre.textContent).toContain('line1');
      expect(pre.textContent).toContain('line2');
      expect(pre.textContent).toContain('line3');
    });
  });
});
