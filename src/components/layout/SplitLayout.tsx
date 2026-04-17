import React, { useEffect, useRef } from 'react';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface SplitLayoutProps {
  isLeftPanelOpen: boolean;
  onLeftPanelOpenChange: (open: boolean) => void;
  isConsolePanelOpen: boolean;
  onConsolePanelOpenChange: (open: boolean) => void;
  descriptionPanel: React.ReactNode;
  editorPanel: React.ReactNode;
  consolePanel: React.ReactNode;
}

export function SplitLayout({
  isLeftPanelOpen,
  onLeftPanelOpenChange,
  isConsolePanelOpen,
  onConsolePanelOpenChange,
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

      <ResizablePanel
        id="description-panel"
        order={1}
        ref={leftPanelRef}
        defaultSize={30}
        minSize={20}
        maxSize={50}
        collapsible
        collapsedSize={2}
        onCollapse={() => onLeftPanelOpenChange(false)}
        onExpand={() => onLeftPanelOpenChange(true)}
        className="flex flex-col"
      >
        {descriptionPanel}
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel id="workspace-panel" order={2} defaultSize={70} minSize={40}>
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={65} minSize={30} className="flex flex-col">
            {editorPanel}
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            ref={consolePanelRef}
            defaultSize={35}
            minSize={8}
            collapsible
            collapsedSize={6}
            onCollapse={() => onConsolePanelOpenChange(false)}
            onExpand={() => onConsolePanelOpenChange(true)}
            className="flex flex-col"
          >
            {consolePanel}
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
