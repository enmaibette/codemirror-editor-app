import React, { useEffect, useRef } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { EditorPanel } from '@/features/editor/EditorPanel';

const TestEditorPanel = EditorPanel as ComponentType<any>;

// Mock useCodeMirror to avoid loading the full CodeMirror bundle in jsdom
vi.mock('@/features/editor/useCodeMirror', () => ({
  useCodeMirror: ({ initialDoc, onChange }: { initialDoc: string; onChange: (v: string) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!containerRef.current) return;
      const textarea = document.createElement('textarea');
      textarea.setAttribute('data-testid', 'codemirror-editor');
      textarea.value = initialDoc;
      textarea.addEventListener('input', (e) => {
        onChange((e.target as HTMLTextAreaElement).value);
      });
      containerRef.current.appendChild(textarea);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { containerRef };
  },
}));

describe('EditorPanel', () => {
  it('renders the EditorSidebar (Files button present)', () => {
    render(<EditorPanel value="" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /files/i })).toBeInTheDocument();
  });

  it('renders the EditorSidebar (Hints button present)', () => {
    render(<EditorPanel value="" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: /hints/i })).toBeInTheDocument();
  });

  it('hides the EditorSidebar when showSidebar is false', () => {
    render(<EditorPanel value="" onChange={vi.fn()} showSidebar={false} />);
    expect(screen.queryByRole('button', { name: /files/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /hints/i })).not.toBeInTheDocument();
  });

  it('renders the CodeMirror editor (mocked textarea)', () => {
    render(<EditorPanel value="" onChange={vi.fn()} />);
    expect(screen.getByTestId('codemirror-editor')).toBeInTheDocument();
  });

  it('passes the value prop into the editor', () => {
    render(<EditorPanel value="class Dog:\n    pass" onChange={vi.fn()} />);
    const editor = screen.getByTestId('codemirror-editor') as HTMLTextAreaElement;
    expect(editor.value).toBe('class Dog:\\n    pass');
  });

  it('calls onChange when editor content changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<EditorPanel value="" onChange={handleChange} />);
    const editor = screen.getByTestId('codemirror-editor');
    await user.type(editor, 'x');
    expect(handleChange).toHaveBeenCalled();
  });

  it('calls onHintClick when the Hints sidebar button is clicked', async () => {
    const user = userEvent.setup();
    const handleHintClick = vi.fn();
    render(<EditorPanel value="" onChange={vi.fn()} onHintClick={handleHintClick} />);
    await user.click(screen.getByRole('button', { name: /hints/i }));
    expect(handleHintClick).toHaveBeenCalledTimes(1);
  });

  it('calls onFileClick when the Files sidebar button is clicked', async () => {
    const user = userEvent.setup();
    const handleFileClick = vi.fn();
    render(<TestEditorPanel value="" onChange={vi.fn()} onFileClick={handleFileClick} />);
    await user.click(screen.getByRole('button', { name: /files/i }));
    expect(handleFileClick).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing when onHintClick is not provided', () => {
    expect(() => {
      render(<EditorPanel value="" onChange={vi.fn()} />);
    }).not.toThrow();
  });
});
