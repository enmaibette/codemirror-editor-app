import { ArrowRight } from 'lucide-react';
import type { Challenge } from '@/types';

interface ChallengeRowProps {
  challenge: Challenge;
  onClick: (id: string) => void;
}

export function ChallengeRow({ challenge, onClick }: ChallengeRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(challenge.id)}
      className="
        w-full flex items-center justify-between
        px-5 py-4 rounded-full
        bg-[var(--elevated)]
        hover:bg-[var(--row-hover)]
        transition-colors duration-150
        text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
        cursor-pointer
      "
    >
      <span className="text-sm font-medium text-[var(--text)]">{challenge.title}</span>
      <ArrowRight className="h-5 w-5 text-[var(--accent)] shrink-0" />
    </button>
  );
}
