import { Card, CardContent } from '@/components/ui/card';
import { StatusIcon } from '@/components/ui/StatusIcon';
import type { TestCase } from '@/types';

interface TestCaseCardProps {
  testCase: TestCase;
}

export function TestCaseCard({ testCase }: TestCaseCardProps) {
  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">{testCase.title}</p>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-xs text-[var(--muted)]">
                Expected:{' '}
                <span className="font-mono text-[var(--text)]">{testCase.expected}</span>
              </span>
              <span className="text-xs text-[var(--muted)]">
                Got:{' '}
                <span className="font-mono text-[var(--text)]">{testCase.got}</span>
              </span>
            </div>
          </div>
          <StatusIcon status={testCase.status} className="shrink-0 mt-0.5" />
        </div>
      </CardContent>
    </Card>
  );
}
