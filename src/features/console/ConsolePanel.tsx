import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OutputTab } from './OutputTab';
import { TestCasesTab } from './TestCasesTab';
import type { ConsoleTab, TestCase } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ConsolePanelProps {
  activeTab: ConsoleTab;
  onTabChange: (tab: ConsoleTab) => void;
  outputLines: string[];
  testCases: TestCase[];
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
}

export function ConsolePanel({
  activeTab,
  onTabChange,
  outputLines,
  testCases,
  onClose,
  onOpen,
  isOpen,
}: ConsolePanelProps) {
  return (
    <div className="flex flex-col h-full bg-[var(--background)] border-t border-[var(--border)]">
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          if (!isOpen) onOpen();
          onTabChange(v as ConsoleTab);
        }}
        className="flex flex-col h-full"
      >
        <div className="flex items-center shrink-0">
          <TabsList className="px-2 flex-1">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          </TabsList>
          <button
            type="button"
            aria-label="Close console panel"
            onClick={onClose}
            className="p-2 mr-1 text-[var(--muted)] hover:text-[var(--text)]"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>

        {isOpen && (
          <>
            <TabsContent value="output" className="flex-1 min-h-0 overflow-hidden">
              <OutputTab outputLines={outputLines} />
            </TabsContent>

            <TabsContent value="testcases" className="flex-1 min-h-0 overflow-hidden">
              <TestCasesTab testCases={testCases} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
