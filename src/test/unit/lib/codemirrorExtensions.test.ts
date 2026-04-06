/**
 * Unit tests for codemirrorExtensions.ts — buildExtensions().
 *
 * All CodeMirror packages are mocked so that no real DOM operations,
 * ResizeObserver, or canvas APIs are needed.  The mocks return lightweight
 * stub values that satisfy TypeScript's Extension type.
 *
 * The suite verifies the public contract:
 *   - buildExtensions returns an Array.
 *   - The returned array is non-empty.
 *   - The function accepts an onChange callback without throwing.
 *   - The updateListener factory is called with a handler that invokes
 *     onChange when docChanged is true on the update object.
 *   - The updateListener handler does NOT invoke onChange when docChanged
 *     is false.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted spy/stub declarations — available inside vi.mock() factories.
// ---------------------------------------------------------------------------

const {
  mockLineNumbers,
  mockHistory,
  mockPython,
  mockAutocompletion,
  mockOneDark,
  mockKeymapOf,
  mockUpdateListenerOf,
  mockTheme,
  capturedUpdateHandler,
} = vi.hoisted(() => {
  // Holder so the updateListener factory can store the captured handler and
  // individual tests can call it directly.
  const capturedUpdateHandler: { current: ((update: unknown) => void) | null } = {
    current: null,
  };

  return {
    mockLineNumbers: vi.fn(() => '__lineNumbers__'),
    mockHistory: vi.fn(() => '__history__'),
    mockPython: vi.fn(() => '__python__'),
    mockAutocompletion: vi.fn(() => '__autocompletion__'),
    mockOneDark: '__oneDark__',
    mockKeymapOf: vi.fn(() => '__keymap__'),
    mockUpdateListenerOf: vi.fn((handler: (update: unknown) => void) => {
      capturedUpdateHandler.current = handler;
      return '__updateListener__';
    }),
    mockTheme: vi.fn(() => '__theme__'),
    capturedUpdateHandler,
  };
});

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('@codemirror/view', () => ({
  lineNumbers: mockLineNumbers,
  keymap: { of: mockKeymapOf },
  EditorView: {
    updateListener: { of: mockUpdateListenerOf },
    theme: mockTheme,
  },
}));

vi.mock('@codemirror/commands', () => ({
  defaultKeymap: [],
  historyKeymap: [],
  indentWithTab: '__indentWithTab__',
  history: mockHistory,
}));

vi.mock('@codemirror/lang-python', () => ({
  python: mockPython,
}));

vi.mock('@codemirror/autocomplete', () => ({
  autocompletion: mockAutocompletion,
}));

vi.mock('@codemirror/theme-one-dark', () => ({
  oneDark: mockOneDark,
}));

// ---------------------------------------------------------------------------
// Import under test — after mocks are in place.
// ---------------------------------------------------------------------------

import { buildExtensions } from '@/lib/codemirrorExtensions';

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildExtensions — return type', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedUpdateHandler.current = null;
  });

  it('returns an Array', () => {
    const result = buildExtensions(vi.fn());
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns a non-empty array', () => {
    const result = buildExtensions(vi.fn());
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('buildExtensions — callback acceptance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedUpdateHandler.current = null;
  });

  it('does not throw when given a no-op callback', () => {
    expect(() => buildExtensions(() => {})).not.toThrow();
  });

  it('does not throw when given a vi.fn() callback', () => {
    expect(() => buildExtensions(vi.fn())).not.toThrow();
  });

  it('does not throw when called multiple times with different callbacks', () => {
    expect(() => {
      buildExtensions(vi.fn());
      buildExtensions(vi.fn());
      buildExtensions(vi.fn());
    }).not.toThrow();
  });
});

describe('buildExtensions — extension count', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedUpdateHandler.current = null;
  });

  it('returns at least 7 extensions (lineNumbers, history, python, autocompletion, oneDark, keymap, updateListener, theme)', () => {
    // The source returns exactly 8 top-level entries.  Asserting >= 7 keeps
    // the test resilient to minor future additions.
    const result = buildExtensions(vi.fn());
    expect(result.length).toBeGreaterThanOrEqual(7);
  });
});

describe('buildExtensions — onChange wiring via EditorView.updateListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedUpdateHandler.current = null;
  });

  it('registers an updateListener via EditorView.updateListener.of', () => {
    buildExtensions(vi.fn());
    expect(mockUpdateListenerOf).toHaveBeenCalledTimes(1);
  });

  it('the updateListener handler invokes onChange when update.docChanged is true', () => {
    const onChange = vi.fn();
    buildExtensions(onChange);

    const handler = capturedUpdateHandler.current;
    expect(handler).not.toBeNull();

    // Simulate a CodeMirror ViewUpdate with docChanged = true.
    handler!({
      docChanged: true,
      state: { doc: { toString: () => 'new content' } },
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('new content');
  });

  it('the updateListener handler does NOT invoke onChange when update.docChanged is false', () => {
    const onChange = vi.fn();
    buildExtensions(onChange);

    const handler = capturedUpdateHandler.current;
    expect(handler).not.toBeNull();

    // Simulate a selection-only ViewUpdate (no document change).
    handler!({
      docChanged: false,
      state: { doc: { toString: () => 'unchanged' } },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('onChange receives the full document string returned by doc.toString()', () => {
    const onChange = vi.fn();
    buildExtensions(onChange);

    capturedUpdateHandler.current!({
      docChanged: true,
      state: { doc: { toString: () => 'def foo():\n    return 42\n' } },
    });

    expect(onChange).toHaveBeenCalledWith('def foo():\n    return 42\n');
  });

  it('onChange can be triggered multiple times for multiple docChanged updates', () => {
    const onChange = vi.fn();
    buildExtensions(onChange);

    const handler = capturedUpdateHandler.current!;

    handler({ docChanged: true, state: { doc: { toString: () => 'line 1' } } });
    handler({ docChanged: true, state: { doc: { toString: () => 'line 2' } } });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'line 1');
    expect(onChange).toHaveBeenNthCalledWith(2, 'line 2');
  });
});
