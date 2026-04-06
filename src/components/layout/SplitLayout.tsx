import { useEffect, useRef } from 'react';
import type React from 'react';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface SplitLayoutProps {
  isLeftPanelOpen: boolean;
  onLeftPanelClose: () => void;
  onLeftPanelOpen?: () => void;
  isConsolePanelOpen: boolean;
  onConsolePanelClose: () => void;
  onConsolePanelOpen: () => void;
  descriptionPanel: React.ReactNode;
  editorPanel: React.ReactNode;
  consolePanel: React.ReactNode;
}

export function SplitLayout({
  isLeftPanelOpen,
  onLeftPanelClose,
  onLeftPanelOpen,
  isConsolePanelOpen,
  onConsolePanelClose,
  onConsolePanelOpen,
  descriptionPanel,
  editorPanel,
  consolePanel,
}: SplitLayoutProps) {
  const leftPanelRef = useRef<ImperativePanelHandle | null>(null);
  const consolePanelRef = useRef<ImperativePanelHandle | null>(null);

  useEffect(() => {
    const panel = leftPanelRef.current;
    if (!panel) return;

    if (isLeftPanelOpen && panel.isCollapsed()) {
      panel.expand();
    }

    if (!isLeftPanelOpen && !panel.isCollapsed()) {
      panel.collapse();
    }
  }, [isLeftPanelOpen]);

  useEffect(() => {
    const panel = consolePanelRef.current;
    if (!panel) return;

    if (isConsolePanelOpen && panel.isCollapsed()) {
      panel.expand();
    }

    if (!isConsolePanelOpen && !panel.isCollapsed()) {
      panel.collapse();
    }
  }, [isConsolePanelOpen]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      {/* Left panel — description */}
      <ResizablePanel
        id="description-panel"
        order={1}
        ref={leftPanelRef}
        defaultSize={isLeftPanelOpen ? 30 : 0}
        minSize={20}
        maxSize={50}
        collapsible
        collapsedSize={0}
        onCollapse={onLeftPanelClose}
        onExpand={onLeftPanelOpen}
        className="flex flex-col"
      >
        {descriptionPanel}
      </ResizablePanel>
      {isLeftPanelOpen && <ResizableHandle withHandle />}

      {/* Right column — editor + console */}
      <ResizablePanel id="workspace-panel" order={2} defaultSize={isLeftPanelOpen ? 70 : 100} minSize={40}>
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Editor — top */}
          <ResizablePanel defaultSize={65} minSize={30} className="flex flex-col">
            {editorPanel}
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Console — bottom */}
          <ResizablePanel
            ref={consolePanelRef}
            defaultSize={35}
            minSize={35}
            collapsible
            collapsedSize={6}
            onCollapse={onConsolePanelClose}
            onExpand={onConsolePanelOpen}
            className="flex flex-col"
          >
            {consolePanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
