import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatusIcon } from '@/components/ui/StatusIcon';

// Helper that returns the rendered SVG element
function getSvg(status: 'pass' | 'fail' | 'pending') {
  const { container: c } = render(<StatusIcon status={status} />);
  return c.querySelector('svg');
}

describe('StatusIcon', () => {
  it('renders an SVG element for "pass"', () => {
    expect(getSvg('pass')).toBeInTheDocument();
  });

  it('renders an SVG element for "fail"', () => {
    expect(getSvg('fail')).toBeInTheDocument();
  });

  it('renders an SVG element for "pending"', () => {
    expect(getSvg('pending')).toBeInTheDocument();
  });

  it('applies green color class for "pass" status', () => {
    const { container: c } = render(<StatusIcon status="pass" />);
    const svg = c.querySelector('svg')!;
    expect(svg.className).toMatch(/3fb950/);
  });

  it('applies destructive color class for "fail" status', () => {
    const { container: c } = render(<StatusIcon status="fail" />);
    const svg = c.querySelector('svg')!;
    expect(svg.className).toMatch(/destructive/);
  });

  it('applies muted color class for "pending" status', () => {
    const { container: c } = render(<StatusIcon status="pending" />);
    const svg = c.querySelector('svg')!;
    expect(svg.className).toMatch(/muted/);
  });

  it('passes additional className prop through for "pass"', () => {
    const { container: c } = render(<StatusIcon status="pass" className="custom-class" />);
    const svg = c.querySelector('svg')!;
    expect(svg.className).toMatch(/custom-class/);
  });

  it('passes additional className prop through for "pending"', () => {
    const { container: c } = render(<StatusIcon status="pending" className="extra" />);
    const svg = c.querySelector('svg')!;
    expect(svg.className).toMatch(/extra/);
  });
});
