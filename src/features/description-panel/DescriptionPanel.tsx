import { memo } from 'react';
import { X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DescriptionTab } from './DescriptionTab';
import { HintTab } from './HintTab';
import type { Challenge } from '@/types';

interface DescriptionPanelProps {
  challenge: Challenge;
  activeTab: 'description' | 'hint';
  onTabChange: (tab: 'description' | 'hint') => void;
  onClose: () => void;
}

export const DescriptionPanel = memo(function DescriptionPanel({
  challenge,
  activeTab,
  onTabChange,
  onClose,
}: DescriptionPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border)]">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as 'description' | 'hint')}
        className="flex flex-col h-full"
      >
        <div className="flex items-center border-b border-[var(--border)] shrink-0">
          <TabsList className="px-2 flex-1 border-b-0">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="hint">Hint</TabsTrigger>
          </TabsList>
          <button
            type="button"
            aria-label="Close description panel"
            onClick={onClose}
            className="p-2 mr-1 text-[var(--muted)] hover:text-[var(--text)] shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <TabsContent value="description" className="flex-1 overflow-y-auto">
          <DescriptionTab challenge={challenge} />
        </TabsContent>

        <TabsContent value="hint" className="flex-1 overflow-y-auto">
          <HintTab hints={challenge.hints} />
        </TabsContent>
      </Tabs>
    </div>
  );
});
