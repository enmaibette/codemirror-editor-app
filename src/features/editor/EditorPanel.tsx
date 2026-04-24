import { memo, useEffect, useRef, useState } from 'react';
import {
  ChevronRightIcon,
  FileIcon,
  Folder,
  FolderIcon,
  X,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCodeMirror } from '@/features/editor/useCodeMirror.ts';
import { useChallengeStore } from '@/stores/challengeStore.ts';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible.tsx';
import { Button } from '@/components/ui/button.tsx';
import type { FileTreeItem } from '@/types';
import {
  CustomDrawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/CustomDrawer.tsx';

function flatFiles(tree: FileTreeItem[]): (FileTreeItem & { type: 'file' })[] {
  return tree.flatMap((item) =>
    item.type === 'folder' ? flatFiles(item.children) : [item as FileTreeItem & { type: 'file' }]
  );
}

export const EditorPanel = memo(function EditorPanel() {
  const editorContent = useChallengeStore((state) => state.editorContent);
  const setEditorContent = useChallengeStore((state) => state.setEditorContent);
  const activeFilePath = useChallengeStore((state) => state.activeFilePath);
  const setActiveFile = useChallengeStore((state) => state.setActiveFile);
  const closeFile = useChallengeStore((state) => state.closeFile);
  const openFile = useChallengeStore((state) => state.openFile);
  const openFilePaths = useChallengeStore((state) => state.openFilePaths);
  const fileTree = useChallengeStore((state) => state.fileTree);

  const [showExplorer, setShowExplorer] = useState(false);
  const explorerRef = useRef<HTMLDivElement>(null);

  const openFiles = flatFiles(fileTree).filter((f) => openFilePaths.includes(f.path));

  const { containerRef: editorRef } = useCodeMirror({
    initialDoc: editorContent,
    onChange: setEditorContent,
  });

  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tabsListRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  useEffect(() => {
    if (!showExplorer) return;
    function handleMouseDown(e: MouseEvent) {
      if (explorerRef.current && !explorerRef.current.contains(e.target as Node)) {
        setShowExplorer(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [showExplorer]);

  const renderItem = (item: FileTreeItem, depth = 0) => {
    if (item.type === 'folder') {
      return (
        <Collapsible key={item.path} defaultOpen={depth === 0}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
              <FolderIcon />
              {item.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 ml-5">
            <div className="flex flex-col gap-1">
              {item.children.map((child) => renderItem(child, depth+1))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <Button
        key={item.path}
        variant="link"
        size="sm"
        className="w-full justify-start gap-2 text-foreground"
        onClick={(e) => { e.stopPropagation(); openFile(item.path); setShowExplorer(false); }}
      >
        <FileIcon />
        <span>{item.name}</span>
      </Button>
    );
  };

  return (
    <div className="flex h-full w-full bg-(--surface) overflow-hidden">
      <Tabs value={activeFilePath ?? ''} onValueChange={setActiveFile} className="flex-1 h-full">
        <div className={'flex justify-between pr-2 gap-1'}>
          <TabsList
            variant="line"
            className="overflow-x-auto overflow-y-hidden flex-1 min-w-0 flex-nowrap w-0 "
          >
            {openFiles.map((f) => (
              <TabsTrigger
                key={f.path}
                value={f.path}
                className="border-r-(--border) data-[state=active]:text-(--text) data-[state=active]:after:opacity-0! shrink-0"
              >
                <span>{f.path.replace(/^[^/]+\//, '')}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 p-0 data-[state=active]:after:opacity-0!"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(f.path);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          <CustomDrawer direction={'right'}>
            <DrawerTrigger>
              <Folder className="h-4 w-4" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className={'flex justify-between flex-row'}>
                <DrawerTitle>File Explorer</DrawerTitle>
                <DrawerClose asChild>
                  <X className="h-4 w-4" />
                </DrawerClose>
              </DrawerHeader>
              <div className="overflow-y-auto px-4">{fileTree.map((item) => renderItem(item))}</div>
            </DrawerContent>
          </CustomDrawer>
        </div>

        <TabsContent value={activeFilePath ?? ''} className="flex-1 overflow-y-auto">
          <div className="flex h-full w-full overflow-hidden bg-(--background)">
            <div ref={editorRef} className="flex-1 h-full" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});
