import { create } from 'zustand';
import type { Challenge, FileTreeItem } from '@/types';
import { challenges as staticChallenges } from '@/data/challenges/index';
import { buildFileTree } from '@/lib/utils';
import { loadFilesystem, saveFilesystem } from '@/lib/db';
import { insertNodeInTree, removeNodeFromTree, renameNodeInTree } from '@/lib/treeUtils';

interface ChallengeState {
  challenges: Challenge[];
  activeChallengeId: string | null;
  activeFilePath: string | null;
  openFilePaths: string[];
  editorContent: string;
  editorContentMap: Record<string, string>;
  fileTree: FileTreeItem[];
  setActiveChallenge: (id: string) => Promise<void>;
  setActiveFile: (path: string) => void;
  closeFile: (path: string) => void;
  openFile: (path: string) => void;
  setEditorContent: (code: string) => void;
  resetEditorToStarter: () => void;
  setFileTree: (tree: FileTreeItem[]) => void;
  createFile: (parentPath: string, fileName: string, content?: string) => void;
  createFolder: (parentPath: string, name: string) => void;
  deleteNode: (path: string) => void;
  renameNode: (path: string, newName: string) => void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: staticChallenges,
  activeChallengeId: null,
  activeFilePath: null,
  openFilePaths: [],
  editorContent: '',
  editorContentMap: {},
  fileTree: [],

  setActiveChallenge: async (id: string) => {
    const { challenges } = get();
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) {
      set({ activeChallengeId: id, editorContent: '', activeFilePath: null, openFilePaths: [], editorContentMap: {}, fileTree: [] });
      return;
    }
    const defaultMap: Record<string, string> = {};
    for (const f of challenge.starterCode) defaultMap[f.path] = f.content;
    const defaultTree = buildFileTree(challenge.starterCode);

    try {
      const saved = await loadFilesystem(id);
      const finalMap = saved ? { ...defaultMap, ...saved.files } : defaultMap;
      const finalTree = saved?.fileTree ?? defaultTree;

      const first = challenge.starterCode[0];
      set({
        activeChallengeId: id,
        editorContentMap: finalMap,
        fileTree: finalTree,
        openFilePaths: challenge.starterCode.map((f) => f.path),
        activeFilePath: first?.path ?? null,
        editorContent: first ? (finalMap[first.path] ?? '') : '',
      });
    } catch {
      const first = challenge.starterCode[0];
      set({
        activeChallengeId: id,
        editorContentMap: defaultMap,
        fileTree: defaultTree,
        openFilePaths: challenge.starterCode.map((f) => f.path),
        activeFilePath: first?.path ?? null,
        editorContent: first ? (defaultMap[first.path] ?? '') : '',
      });
    }
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
    const { activeFilePath, editorContentMap, activeChallengeId, fileTree } = get();
    const newMap = activeFilePath
      ? { ...editorContentMap, [activeFilePath]: code }
      : editorContentMap;
    set({ editorContent: code, editorContentMap: newMap });
    if (activeChallengeId) {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        saveFilesystem(activeChallengeId, { files: newMap, fileTree }).catch(() => {});
      }, 500);
    }
  },

  resetEditorToStarter: () => {
    const { challenges, activeChallengeId, activeFilePath } = get();
    const challenge = challenges.find((c) => c.id === activeChallengeId);
    if (!challenge) return;
    const map: Record<string, string> = {};
    for (const f of challenge.starterCode) map[f.path] = f.content;
    const tree = buildFileTree(challenge.starterCode);
    const content = activeFilePath ? (map[activeFilePath] ?? '') : '';
    set({ editorContentMap: map, editorContent: content, fileTree: tree });
    if (activeChallengeId) saveFilesystem(activeChallengeId, { files: map, fileTree: tree }).catch(() => {});
  },

  setFileTree: (tree: FileTreeItem[]) => set({ fileTree: tree }),

  createFile: (parentPath: string, fileName: string, content = '') => {
    const { fileTree, editorContentMap, activeChallengeId } = get();
    const path = parentPath ? `${parentPath}/${fileName}` : fileName;
    const node: FileTreeItem = { type: 'file', name: fileName, path };
    const newTree = insertNodeInTree(fileTree, parentPath, node);
    const newMap = { ...editorContentMap, [path]: content };
    set({ fileTree: newTree, editorContentMap: newMap });
    if (activeChallengeId) saveFilesystem(activeChallengeId, { files: newMap, fileTree: newTree }).catch(() => {});
  },

  createFolder: (parentPath: string, name: string) => {
    const { fileTree, editorContentMap, activeChallengeId } = get();
    const path = parentPath ? `${parentPath}/${name}` : name;
    const node: FileTreeItem = { type: 'folder', name, path, children: [] };
    const newTree = insertNodeInTree(fileTree, parentPath, node);
    set({ fileTree: newTree });
    if (activeChallengeId) saveFilesystem(activeChallengeId, { files: editorContentMap, fileTree: newTree }).catch(() => {});
  },

  deleteNode: (path: string) => {
    const { fileTree, editorContentMap, activeChallengeId, openFilePaths, activeFilePath } = get();
    const newTree = removeNodeFromTree(fileTree, path);
    const newMap = { ...editorContentMap };
    delete newMap[path];
    const newOpenPaths = openFilePaths.filter((p) => p !== path);
    const newActive = activeFilePath === path ? (newOpenPaths[0] ?? null) : activeFilePath;
    set({
      fileTree: newTree,
      editorContentMap: newMap,
      openFilePaths: newOpenPaths,
      activeFilePath: newActive,
      editorContent: newActive ? (newMap[newActive] ?? '') : '',
    });
    if (activeChallengeId) saveFilesystem(activeChallengeId, { files: newMap, fileTree: newTree }).catch(() => {});
  },

  renameNode: (path: string, newName: string) => {
    const { fileTree, editorContentMap, activeChallengeId } = get();
    const newTree = renameNodeInTree(fileTree, path, newName);
    set({ fileTree: newTree });
    if (activeChallengeId) saveFilesystem(activeChallengeId, { files: editorContentMap, fileTree: newTree }).catch(() => {});
  },
}));
