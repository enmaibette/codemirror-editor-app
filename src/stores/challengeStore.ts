import { create } from 'zustand';
import type { Challenge } from '@/types';
import { challenges as staticChallenges } from '@/data/challenges/index';

interface ChallengeState {
  challenges: Challenge[];
  activeChallengeId: string | null;
  editorContent: string;
  setActiveChallenge: (id: string) => void;
  setEditorContent: (code: string) => void;
  resetEditorToStarter: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: staticChallenges,
  activeChallengeId: null,
  editorContent: '',

  setActiveChallenge: (id: string) => {
    const { challenges } = get();
    const challenge = challenges.find((c) => c.id === id);
    set({
      activeChallengeId: id,
      editorContent: challenge ? challenge.starterCode : '',
    });
  },

  setEditorContent: (code: string) => {
    set({ editorContent: code });
  },

  resetEditorToStarter: () => {
    const { challenges, activeChallengeId } = get();
    const challenge = challenges.find((c) => c.id === activeChallengeId);
    if (challenge) {
      set({ editorContent: challenge.starterCode });
    }
  },
}));
