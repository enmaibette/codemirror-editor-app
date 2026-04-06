import { useNavigate } from 'react-router-dom';
import { ChallengeRow } from '@/components/ui/ChallengeRow';
import { useChallengeStore } from '@/stores/challengeStore';

export function ChallengeList() {
  const challenges = useChallengeStore((state) => state.challenges);
  const navigate = useNavigate();

  const handleChallengeClick = (id: string) => {
    navigate(`/challenge/${id}`);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {challenges.map((challenge) => (
        <ChallengeRow
          key={challenge.id}
          challenge={challenge}
          onClick={handleChallengeClick}
        />
      ))}
    </div>
  );
}
