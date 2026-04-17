import { create } from 'zustand';
import type { Challenge } from '@/types';
import { challenges as staticChallenges } from '@/data/challenges/index';

interface ChallengeState {
  challenges: Challenge[];
  activeChallengeId: string | null;
  activeFilePath: string | null;
  openFilePaths: string[];
  editorContent: string;
  editorContentMap: Record<string, string>;
  setActiveChallenge: (id: string) => void;
  setActiveFile: (path: string) => void;
  closeFile: (path: string) => void;
  openFile: (path: string) => void;
  setEditorContent: (code: string) => void;
  resetEditorToStarter: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: staticChallenges,
  activeChallengeId: null,
  activeFilePath: null,
  openFilePaths: [],
  editorContent: '',
  editorContentMap: {},

  setActiveChallenge: (id: string) => {
    const { challenges } = get();
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) {
      set({ activeChallengeId: id, editorContent: '', activeFilePath: null, openFilePaths: [], editorContentMap: {} });
      return;
    }
    const map: Record<string, string> = {};
    for (const f of challenge.starterCode) map[f.path] = f.content;
    const first = challenge.starterCode[0];
    set({
      activeChallengeId: id,
      editorContentMap: map,
      openFilePaths: challenge.starterCode.map((f) => f.path),
      activeFilePath: first?.path ?? null,
      editorContent: first?.content ?? '',
    });
  },

  setActiveFile: (path: string) => {
    const { activeFilePath, editorContent, editorContentMap } = get();
    const updatedMap = {
      ...editorContentMap,
      ...(activeFilePath ? { [activeFilePath]: editorContent } : {}),
    };
    const newContent = updatedMap[path] ?? '';
    set({ activeFilePath: path, editorContent: newContent, editorContentMap: updatedMap });
  },

  closeFile: (path: string) => {
    const { openFilePaths, activeFilePath, editorContent, editorContentMap } = get();
    const updatedMap = {
      ...editorContentMap,
      ...(activeFilePath ? { [activeFilePath]: editorContent } : {}),
    };
    const remaining = openFilePaths.filter((p) => p !== path);

    if (activeFilePath !== path) {
      set({ openFilePaths: remaining, editorContentMap: updatedMap });
      return;
    }

    // Active tab was closed — switch to the nearest neighbour
    const closedIndex = openFilePaths.indexOf(path);
    const nextPath = remaining[closedIndex] ?? remaining[closedIndex - 1] ?? null;
    const newContent = nextPath ? (updatedMap[nextPath] ?? '') : '';
    set({
      openFilePaths: remaining,
      editorContentMap: updatedMap,
      activeFilePath: nextPath,
      editorContent: newContent,
    });
  },

  openFile: (path: string) => {
    const { openFilePaths, activeFilePath, editorContent, editorContentMap } = get();
    // Save current edits before switching
    const updatedMap = {
      ...editorContentMap,
      ...(activeFilePath ? { [activeFilePath]: editorContent } : {}),
    };
    const alreadyOpen = openFilePaths.includes(path);
    const newOpenPaths = alreadyOpen ? openFilePaths : [...openFilePaths, path];
    const newContent = updatedMap[path] ?? '';
    set({ openFilePaths: newOpenPaths, activeFilePath: path, editorContent: newContent, editorContentMap: updatedMap });
  },

  setEditorContent: (code: string) => {
    const { activeFilePath, editorContentMap } = get();
    set({
      editorContent: code,
      editorContentMap: activeFilePath
        ? { ...editorContentMap, [activeFilePath]: code }
        : editorContentMap,
    });
  },

  resetEditorToStarter: () => {
    const { challenges, activeChallengeId, activeFilePath } = get();
    const challenge = challenges.find((c) => c.id === activeChallengeId);
    if (!challenge) return;
    const map: Record<string, string> = {};
    for (const f of challenge.starterCode) map[f.path] = f.content;
    const content = activeFilePath ? (map[activeFilePath] ?? '') : '';
    set({ editorContentMap: map, editorContent: content });
  },
}));
