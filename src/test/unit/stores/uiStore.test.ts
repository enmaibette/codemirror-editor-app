import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/stores/uiStore';

const initialState = {
  isLeftPanelOpen: true,
  isConsolePanelOpen: true,
  consoleActiveTab: 'output' as const,
  descriptionActiveTab: 'description' as const,
  outputLines: [] as string[],
};

beforeEach(() => {
  useUIStore.setState(initialState);
});

describe('uiStore — initial state', () => {
  it('isLeftPanelOpen is true', () => {
    expect(useUIStore.getState().isLeftPanelOpen).toBe(true);
  });

  it('isConsolePanelOpen is true', () => {
    expect(useUIStore.getState().isConsolePanelOpen).toBe(true);
  });

  it('consoleActiveTab is "output"', () => {
    expect(useUIStore.getState().consoleActiveTab).toBe('output');
  });

  it('outputLines is an empty array', () => {
    expect(useUIStore.getState().outputLines).toEqual([]);
  });

  it('descriptionActiveTab is "description"', () => {
    expect(useUIStore.getState().descriptionActiveTab).toBe('description');
  });
});

describe('uiStore — setLeftPanelOpen', () => {
  it('sets isLeftPanelOpen to false', () => {
    useUIStore.getState().setLeftPanelOpen(false);
    expect(useUIStore.getState().isLeftPanelOpen).toBe(false);
  });

  it('sets isLeftPanelOpen back to true', () => {
    useUIStore.getState().setLeftPanelOpen(false);
    useUIStore.getState().setLeftPanelOpen(true);
    expect(useUIStore.getState().isLeftPanelOpen).toBe(true);
  });
});

describe('uiStore — appendOutputLine', () => {
  it('adds a line to outputLines', () => {
    useUIStore.getState().appendOutputLine('hello');
    expect(useUIStore.getState().outputLines).toEqual(['hello']);
  });

  it('appends multiple lines in order', () => {
    useUIStore.getState().appendOutputLine('first');
    useUIStore.getState().appendOutputLine('second');
    useUIStore.getState().appendOutputLine('third');
    expect(useUIStore.getState().outputLines).toEqual(['first', 'second', 'third']);
  });
});

describe('uiStore — clearOutput', () => {
  it('empties outputLines', () => {
    useUIStore.getState().appendOutputLine('line 1');
    useUIStore.getState().appendOutputLine('line 2');
    useUIStore.getState().clearOutput();
    expect(useUIStore.getState().outputLines).toEqual([]);
  });

  it('is idempotent when called on already-empty outputLines', () => {
    useUIStore.getState().clearOutput();
    expect(useUIStore.getState().outputLines).toEqual([]);
  });
});

describe('uiStore — setConsoleActiveTab', () => {
  it('updates consoleActiveTab to "testcases"', () => {
    useUIStore.getState().setConsoleActiveTab('testcases');
    expect(useUIStore.getState().consoleActiveTab).toBe('testcases');
  });

  it('switches consoleActiveTab back to "output"', () => {
    useUIStore.getState().setConsoleActiveTab('testcases');
    useUIStore.getState().setConsoleActiveTab('output');
    expect(useUIStore.getState().consoleActiveTab).toBe('output');
  });
});

describe('uiStore — setConsolePanelOpen', () => {
  it('sets isConsolePanelOpen to false', () => {
    useUIStore.getState().setConsolePanelOpen(false);
    expect(useUIStore.getState().isConsolePanelOpen).toBe(false);
  });

  it('sets isConsolePanelOpen back to true', () => {
    useUIStore.getState().setConsolePanelOpen(false);
    useUIStore.getState().setConsolePanelOpen(true);
    expect(useUIStore.getState().isConsolePanelOpen).toBe(true);
  });
});

describe('uiStore — setDescriptionActiveTab', () => {
  it('updates descriptionActiveTab to "hint"', () => {
    useUIStore.getState().setDescriptionActiveTab('hint');
    expect(useUIStore.getState().descriptionActiveTab).toBe('hint');
  });

  it('switches descriptionActiveTab back to "description"', () => {
    useUIStore.getState().setDescriptionActiveTab('hint');
    useUIStore.getState().setDescriptionActiveTab('description');
    expect(useUIStore.getState().descriptionActiveTab).toBe('description');
  });
});
