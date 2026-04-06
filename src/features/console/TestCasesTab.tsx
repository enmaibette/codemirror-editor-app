import { TestCaseCard } from '@/components/ui/TestCaseCard';
import type { TestCase } from '@/types';

interface TestCasesTabProps {
  testCases: TestCase[];
}

export function TestCasesTab({ testCases }: TestCasesTabProps) {
  if (testCases.length === 0) {
    return (
      <div className="p-4 text-sm text-[var(--muted)]">
        No test cases defined for this challenge.
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-3 space-y-2">
      {testCases.map((tc) => (
        <TestCaseCard key={tc.id} testCase={tc} />
      ))}
    </div>
  );
}
