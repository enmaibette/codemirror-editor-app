/**
 * Unit tests for useCodeMirror hook.
 *
 * All CodeMirror internals (@codemirror/view, @codemirror/state, and the
 * buildExtensions helper) are mocked so that no real DOM operations or
 * canvas/ResizeObserver APIs — absent in jsdom — are exercised.
 *
 * The tests focus on the hook's observable contract:
 *   - It returns a { containerRef } object.
 *   - EditorView is constructed exactly once when a container element exists.
 *   - EditorView.destroy is called when the component unmounts.
 *   - The onChange callback is wired through onChangeRef so that it can be
 *     invoked by the updateListener even after re-renders.
 *
 * vi.hoisted() is used so that the mock factory closures can reference the
 * spy variables without hitting the TDZ (Temporal Dead Zone) that would occur
 * if we declared let/const above a hoisted vi.mock() call.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type React from 'react';

// ---------------------------------------------------------------------------
// Hoisted spy declarations — these are initialized before any module code
// runs, so the vi.mock() factories below can safely close over them.
// ---------------------------------------------------------------------------
const { mockDestroy, MockEditorView, mockEditorStateCreate, capturedOnChangeHolder } =
  vi.hoisted(() => {
    const mockDestroy = vi.fn();

    // A holder object so the captured onChange can be mutated by the factory
    // and read by the tests (plain `let` captured into a closure).
    const capturedOnChangeHolder: { current: ((v: string) => void) | null } = {
      current: null,
    };

    // Constructor mock — each instance gets the shared destroy spy.
    const MockEditorView = vi.fn(function (this: { destroy: typeof mockDestroy }) {
      this.destroy = mockDestroy;
    });

    const mockEditorStateCreate = vi.fn(() => ({ __type: 'MockEditorState' }));

    return { mockDestroy, MockEditorView, mockEditorStateCreate, capturedOnChangeHolder };
  });

// ---------------------------------------------------------------------------
// Module mocks — declared after vi.hoisted() but hoisted to the top by Vitest
// at transform time, so the spy references above are already in scope.
// ---------------------------------------------------------------------------

vi.mock('@/lib/codemirrorExtensions', () => ({
  buildExtensions: vi.fn((onChange: (value: string) => void) => {
    capturedOnChangeHolder.current = onChange;
    return ['__mock_extension__'];
  }),
}));

vi.mock('@codemirror/state', () => ({
  EditorState: {
    create: mockEditorStateCreate,
  },
}));

vi.mock('@codemirror/view', () => ({
  EditorView: MockEditorView,
}));

// ---------------------------------------------------------------------------
// Import the hook AFTER the mocks are in place.
// ---------------------------------------------------------------------------
import { useCodeMirror } from '@/features/editor/useCodeMirror';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeContainer(): HTMLDivElement {
  return document.createElement('div');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useCodeMirror — return shape', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnChangeHolder.current = null;
  });

  it('returns an object with a containerRef property', () => {
    const { result } = renderHook(() =>
      useCodeMirror({ initialDoc: '', onChange: vi.fn() }),
    );

    expect(result.current).toHaveProperty('containerRef');
  });

  it('containerRef is a React ref object (has a "current" key)', () => {
    const { result } = renderHook(() =>
      useCodeMirror({ initialDoc: '', onChange: vi.fn() }),
    );

    expect(result.current.containerRef).toHaveProperty('current');
  });

  it('containerRef.current is null on initial render (no DOM element assigned)', () => {
    const { result } = renderHook(() =>
      useCodeMirror({ initialDoc: '', onChange: vi.fn() }),
    );

    expect(result.current.containerRef.current).toBeNull();
  });
});

describe('useCodeMirror — EditorView construction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnChangeHolder.current = null;
  });

  it('does NOT construct an EditorView when containerRef.current is null', () => {
    renderHook(() => useCodeMirror({ initialDoc: '', onChange: vi.fn() }));

    // The ref is null (no DOM element), so the early-return guard in the
    // effect should prevent EditorView from being instantiated.
    expect(MockEditorView).not.toHaveBeenCalled();
  });

  it('constructs an EditorView when a container element is present and initialDoc changes', () => {
    const container = makeContainer();
    let refHolder: React.MutableRefObject<HTMLDivElement | null>;

    const { rerender } = renderHook(
      ({ doc }: { doc: string }) => {
        const hook = useCodeMirror({ initialDoc: doc, onChange: vi.fn() });
        refHolder = hook.containerRef as React.MutableRefObject<HTMLDivElement | null>;
        return hook;
      },
      { initialProps: { doc: 'first' } },
    );

    // Attach a real element to the ref, then trigger the effect by
    // changing initialDoc (the effect's only declared dependency).
    act(() => {
      refHolder!.current = container;
    });

    vi.clearAllMocks();

    rerender({ doc: 'second' });

    expect(MockEditorView).toHaveBeenCalledTimes(1);
  });

  it('passes the initialDoc to EditorState.create', () => {
    const container = makeContainer();
    let refHolder: React.MutableRefObject<HTMLDivElement | null>;

    const { rerender } = renderHook(
      ({ doc }: { doc: string }) => {
        const hook = useCodeMirror({ initialDoc: doc, onChange: vi.fn() });
        refHolder = hook.containerRef as React.MutableRefObject<HTMLDivElement | null>;
        return hook;
      },
      { initialProps: { doc: 'init' } },
    );

    act(() => {
      refHolder!.current = container;
    });

    vi.clearAllMocks();
    capturedOnChangeHolder.current = null;

    rerender({ doc: 'def foo(): pass' });

    expect(mockEditorStateCreate).toHaveBeenCalledWith(
      expect.objectContaining({ doc: 'def foo(): pass' }),
    );
  });

  it('passes the container element as the EditorView parent option', () => {
    const container = makeContainer();
    let refHolder: React.MutableRefObject<HTMLDivElement | null>;

    const { rerender } = renderHook(
      ({ doc }: { doc: string }) => {
        const hook = useCodeMirror({ initialDoc: doc, onChange: vi.fn() });
        refHolder = hook.containerRef as React.MutableRefObject<HTMLDivElement | null>;
        return hook;
      },
      { initialProps: { doc: 'a' } },
    );

    act(() => {
      refHolder!.current = container;
    });

    vi.clearAllMocks();

    rerender({ doc: 'b' });

    expect(MockEditorView).toHaveBeenCalledWith(
      expect.objectContaining({ parent: container }),
    );
  });
});

describe('useCodeMirror — EditorView.destroy on unmount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnChangeHolder.current = null;
  });

  it('calls EditorView.destroy when the component unmounts', () => {
    const container = makeContainer();
    let refHolder: React.MutableRefObject<HTMLDivElement | null>;

    const { unmount, rerender } = renderHook(
      ({ doc }: { doc: string }) => {
        const hook = useCodeMirror({ initialDoc: doc, onChange: vi.fn() });
        refHolder = hook.containerRef as React.MutableRefObject<HTMLDivElement | null>;
        return hook;
      },
      { initialProps: { doc: 'start' } },
    );

    // Attach container and re-render to force the effect to run with a live ref.
    act(() => {
      refHolder!.current = container;
    });
    rerender({ doc: 'trigger' });

    vi.clearAllMocks();

    // Unmount — the cleanup function should call destroy.
    unmount();

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('calls EditorView.destroy when initialDoc changes (previous view cleaned up)', () => {
    const container = makeContainer();
    let refHolder: React.MutableRefObject<HTMLDivElement | null>;

    const { rerender } = renderHook(
      ({ doc }: { doc: string }) => {
        const hook = useCodeMirror({ initialDoc: doc, onChange: vi.fn() });
        refHolder = hook.containerRef as React.MutableRefObject<HTMLDivElement | null>;
        return hook;
      },
      { initialProps: { doc: 'challenge-1' } },
    );

    act(() => {
      refHolder!.current = container;
    });

    // Create first view.
    rerender({ doc: 'challenge-2' });

    const destroyCountAfterFirst = mockDestroy.mock.calls.length;

    // Switch to a new challenge — previous view should be destroyed.
    rerender({ doc: 'challenge-3' });

    expect(mockDestroy.mock.calls.length).toBeGreaterThan(destroyCountAfterFirst);
  });
});

/**
 * Helper: render the hook with a real container element and trigger the
 * EditorView effect by providing a new initialDoc after the ref is populated.
 *
 * Returns { rerender, unmount, getRef, getCapturedOnChange } so individual
 * tests can assert on whatever they need.
 *
 * Flow:
 *   1. renderHook with initialDoc='init' — ref is null, effect fires but bails.
 *   2. act: assign a real element to the ref.
 *   3. rerender with initialDoc='trigger' — effect fires with live ref,
 *      EditorView is constructed, buildExtensions captures onChange.
 */
function setupWithLiveRef(onChange: (v: string) => void) {
  const container = makeContainer();
  let refHolder: React.MutableRefObject<HTMLDivElement | null>;

  const utils = renderHook(
    ({ doc, cb }: { doc: string; cb: (v: string) => void }) => {
      const hook = useCodeMirror({ initialDoc: doc, onChange: cb });
      refHolder = hook.containerRef as React.MutableRefObject<HTMLDivElement | null>;
      return hook;
    },
    { initialProps: { doc: 'init', cb: onChange } },
  );

  act(() => {
    refHolder!.current = container;
  });

  // Clear any mocks set during the null-ref render, then trigger the live effect.
  vi.clearAllMocks();
  capturedOnChangeHolder.current = null;

  utils.rerender({ doc: 'trigger', cb: onChange });

  return {
    ...utils,
    rerender: (props: { doc: string; cb: (v: string) => void }) =>
      utils.rerender(props),
    getRef: () => refHolder,
  };
}

describe('useCodeMirror — onChange wiring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnChangeHolder.current = null;
  });

  it('wires the onChange callback through buildExtensions', () => {
    const onChange = vi.fn();
    setupWithLiveRef(onChange);

    // capturedOnChangeHolder.current is the wrapper passed to buildExtensions.
    // Calling it should invoke the onChange mock.
    act(() => {
      capturedOnChangeHolder.current?.('hello');
    });

    expect(onChange).toHaveBeenCalledWith('hello');
  });

  it('the captured onChange callback can be invoked multiple times', () => {
    const onChange = vi.fn();
    setupWithLiveRef(onChange);

    act(() => {
      capturedOnChangeHolder.current?.('line 1');
      capturedOnChangeHolder.current?.('line 2');
    });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'line 1');
    expect(onChange).toHaveBeenNthCalledWith(2, 'line 2');
  });

  it('routes onChange calls through onChangeRef — updated callback is used without re-creating the editor', () => {
    // This test validates the stable-callback pattern: the EditorView effect
    // is keyed on [initialDoc] only.  When the parent re-renders with a new
    // onChange function but the SAME initialDoc, the editor is NOT recreated,
    // but the new onChange IS invoked on subsequent document updates because
    // the wrapper in buildExtensions closes over onChangeRef.current.

    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    const { rerender } = setupWithLiveRef(firstOnChange);

    // Record how many times EditorView was constructed up to this point.
    const constructorCallsBefore = (MockEditorView as ReturnType<typeof vi.fn>).mock.calls.length;

    // Re-render with the same doc ('trigger') but a new callback — the main
    // effect does NOT re-run (initialDoc unchanged), so no new EditorView.
    rerender({ doc: 'trigger', cb: secondOnChange });

    const constructorCallsAfter = (MockEditorView as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(constructorCallsAfter).toBe(constructorCallsBefore); // no new view created

    // The callback-sync effect (no deps) runs every render and updates
    // onChangeRef.current to secondOnChange.  Invoking the captured wrapper
    // should therefore call secondOnChange, not firstOnChange.
    act(() => {
      capturedOnChangeHolder.current?.('typed text');
    });

    expect(secondOnChange).toHaveBeenCalledWith('typed text');
    expect(firstOnChange).not.toHaveBeenCalled();
  });
});
