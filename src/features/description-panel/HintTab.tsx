import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Hint } from '@/types';

interface HintTabProps {
  hints: Hint[];
}

export function HintTab({ hints }: HintTabProps) {
  if (hints.length === 0) {
    return (
      <div className="p-4 text-sm text-[var(--muted)]">
        No hints available for this challenge.
      </div>
    );
  }

  return (
    <div className="p-4">
      <Accordion type="multiple" className="w-full">
        {hints.map((hint, index) => (
          <AccordionItem key={hint.id} value={hint.id}>
            <AccordionTrigger>
              <span className="text-sm">Hint {index + 1}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-[var(--text)] leading-relaxed">{hint.text}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
