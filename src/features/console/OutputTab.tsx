import { CONSOLE_RUNNING_LINE, CONSOLE_EMPTY_PLACEHOLDER } from '@/lib/constants';

interface OutputTabProps {
  outputLines: string[];
}

export function OutputTab({ outputLines }: OutputTabProps) {
  return (
    <div className="flex-1 h-full overflow-auto bg-[var(--background)] p-3">
      {outputLines.length === 0 ? (
        <pre className="font-mono text-xs text-[var(--muted)] leading-relaxed whitespace-pre">
          {`${CONSOLE_RUNNING_LINE}\n${CONSOLE_EMPTY_PLACEHOLDER}`}
        </pre>
      ) : (
        <pre className="font-mono text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed">
          {outputLines.join('\n')}
        </pre>
      )}
    </div>
  );
}
