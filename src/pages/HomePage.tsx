import { ChallengeList } from '@/features/challenge-list/ChallengeList';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-full bg-[var(--background)]">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg px-4">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--accent)]">{'</>'} Python OOP</h1>
        </div>

        <div className="w-full">
          <ChallengeList />
        </div>
      </div>
    </div>
  );
}
