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
        bg-(--elevated)
        hover:bg-(--row-hover)
        transition-colors duration-150
        text-left
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)
        cursor-pointer
      "
    >
      <span className="text-sm font-medium text(--text)">{challenge.title}</span>
      <ArrowRight className="h-5 w-5 text(--accent) shrink-0" />
    </button>
  );
}
