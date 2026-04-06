import { create } from 'zustand';
import type { ConsoleTab } from '@/types';

interface UIState {
  isLeftPanelOpen: boolean;
  consoleActiveTab: ConsoleTab;
  descriptionActiveTab: 'description' | 'hint';
  outputLines: string[];
  setLeftPanelOpen: (open: boolean) => void;
  setConsoleActiveTab: (tab: ConsoleTab) => void;
  setDescriptionActiveTab: (tab: 'description' | 'hint') => void;
  appendOutputLine: (line: string) => void;
  clearOutput: () => void;
  isConsolePanelOpen: boolean;
  setConsolePanelOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLeftPanelOpen: true,
  consoleActiveTab: 'output',
  descriptionActiveTab: 'description',
  outputLines: [],
  isConsolePanelOpen: true,

  setLeftPanelOpen: (open: boolean) => {
    set({ isLeftPanelOpen: open });
  },

  setConsoleActiveTab: (tab: ConsoleTab) => {
    set({ consoleActiveTab: tab });
  },

  setDescriptionActiveTab: (tab: 'description' | 'hint') => {
    set({ descriptionActiveTab: tab });
  },

  appendOutputLine: (line: string) => {
    set((state) => ({ outputLines: [...state.outputLines, line] }));
  },

  clearOutput: () => {
    set({ outputLines: [] });
  },

  setConsolePanelOpen: (open: boolean) => {
    set({ isConsolePanelOpen: open });
  }
}));
