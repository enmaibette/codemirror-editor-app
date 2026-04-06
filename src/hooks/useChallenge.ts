import { useChallengeStore } from '@/stores/challengeStore';
import type { Challenge } from '@/types';

export function useChallenge(id?: string): Challenge | undefined {
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId);
  const challenges = useChallengeStore((state) => state.challenges);
  const challengeId = id ?? activeChallengeId ?? undefined;

  if (!challengeId) return undefined;
  return challenges.find((c) => c.id === challengeId);
}
