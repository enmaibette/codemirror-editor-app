import { memo } from 'react';
import { X, FileText, Lightbulb } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DescriptionTab } from './DescriptionTab';
import { HintTab } from './HintTab';
import type { Challenge } from '@/types';

interface DescriptionPanelProps {
  challenge: Challenge;
  activeTab: 'description' | 'hint';
  onTabChange: (tab: 'description' | 'hint') => void;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
}

export const DescriptionPanel = memo(function DescriptionPanel({
  challenge,
  activeTab,
  onTabChange,
  onOpenChange,
  isOpen,
}: DescriptionPanelProps) {
  console.log("isOpen", isOpen)
  return (
    <div className="flex flex-col h-full bg-(--surface) border-r border-(--border)">
      <Tabs
        value={activeTab}
        orientation={isOpen ? 'horizontal' : 'vertical'}
        onValueChange={(v) => {
          if (!isOpen) onOpenChange(true);
          onTabChange(v as 'description' | 'hint');
        }}
        className="flex flex-col h-full"
      >
        <div className={isOpen
          ? 'flex items-center border-b border-(--border) shrink-0'
          : 'flex flex-col items-center py-1 shrink-0'
        }>
          <TabsList
            variant="line"
            className={isOpen
              ? 'px-2 flex-1 border-b-0'
              : 'flex flex-col h-auto bg-transparent gap-1 p-1'
            }
          >
            <TabsTrigger value="description">
              {isOpen ? 'Description' : <FileText className="h-4 w-4" />}
            </TabsTrigger>
            <TabsTrigger value="hint">
              {isOpen ? 'Hint' : <Lightbulb className="h-4 w-4" />}
            </TabsTrigger>
          </TabsList>
          {isOpen && (<button
            type="button"
            aria-label="Close description panel"
            onClick={() => onOpenChange(false)}
            className="p-2 text-(--muted) hover:text-(--text)"
          >
            <X className="h-4 w-4" />
          </button>)}
        </div>

        {isOpen && (
          <>
            <TabsContent value="description" className="flex-1 overflow-y-auto">
              <DescriptionTab challenge={challenge} />
            </TabsContent>

            <TabsContent value="hint" className="flex-1 overflow-y-auto">
              <HintTab hints={challenge.hints} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
});
