import ReactMarkdown from 'react-markdown';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { ShikiCodeBlock } from './ShikiCodeBlock';
import type { Challenge } from '@/types';

interface DescriptionTabProps {
  challenge: Challenge;
}

export function DescriptionTab({ challenge }: DescriptionTabProps) {
  const markdown = challenge.descriptionMarkdown.replace(/^##\s+Description\s*\n/, '');

  return (
    <div className="p-4 space-y-5">
      <div className="flex items-start gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-(--text) leading-tight">
          {challenge.title}
        </h2>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      <div className="text-sm leading-relaxed text-(--text) space-y-4">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h3 className="text-sm font-semibold text-(--text) mt-4">{children}</h3>
            ),
            ul: ({ children }) => (
              <ul className="space-y-1.5 list-disc pl-5">{children}</ul>
            ),
            code({ className, children }) {
              const lang = /language-(\w+)/.exec(className ?? '')?.[1];
              return lang === 'python' ? (
                <ShikiCodeBlock code={String(children).trim()} lang="python" />
              ) : (
                <code className="rounded bg-(--elevated) px-1 py-0.5 text-[0.9em]">
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
