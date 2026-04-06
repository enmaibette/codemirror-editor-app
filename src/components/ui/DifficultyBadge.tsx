import { Badge } from '@/components/ui/badge';
import type { Difficulty } from '@/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const variantMap: Record<Difficulty, 'easy' | 'medium' | 'hard'> = {
    Easy: 'easy',
    Medium: 'medium',
    Hard: 'hard',
  };

  return <Badge variant={variantMap[difficulty]}>{difficulty}</Badge>;
}
