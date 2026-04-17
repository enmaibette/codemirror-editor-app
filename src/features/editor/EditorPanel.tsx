import { memo, useEffect, useRef, useState } from 'react';
import { FileCode, Folder, FolderOpen, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCodeMirror } from '@/features/editor/useCodeMirror.ts';
import { useChallengeStore } from '@/stores/challengeStore.ts';

export const EditorPanel = memo(function EditorPanel() {
  const editorContent = useChallengeStore((state) => state.editorContent);
  const setEditorContent = useChallengeStore((state) => state.setEditorContent);
  const activeFilePath = useChallengeStore((state) => state.activeFilePath);
  const setActiveFile = useChallengeStore((state) => state.setActiveFile);
  const closeFile = useChallengeStore((state) => state.closeFile);
  const openFile = useChallengeStore((state) => state.openFile);
  const openFilePaths = useChallengeStore((state) => state.openFilePaths);
  const activeChallengeId = useChallengeStore((state) => state.activeChallengeId);
  const challenges = useChallengeStore((state) => state.challenges);

  const [showExplorer, setShowExplorer] = useState(false);
  const explorerRef = useRef<HTMLDivElement>(null);

  const activeChallenge = challenges.find((c) => c.id === activeChallengeId);
  const allFiles = activeChallenge?.starterCode ?? [];
  const openFiles = allFiles.filter((f) => openFilePaths.includes(f.path));

  const { containerRef: editorRef } = useCodeMirror({
    initialDoc: editorContent,
    onChange: setEditorContent,
  });

  // Close explorer when clicking outside
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

  return (
    <div className="flex flex-col h-full bg-[var(--surface)]">
      <Tabs
        value={activeFilePath ?? ''}
        onValueChange={setActiveFile}
        className="flex flex-col h-full"
      >
        <div className={'flex items-center border-b border-[var(--border)] shrink-0'}>
          <TabsList className={'px-2 flex-1 border-b-0 border-r border-[var(--border)]'}>
            {openFiles.map((f) => (
              <TabsTrigger
                key={f.path}
                value={f.path}
                className="group flex items-center gap-1 pr-1 border-r border-r-[var(--border)] data-[state=active]:text-[var(--text)] data-[state=active]:border-b-transparent data-[state=active]:border-r-[var(--border)]"
              >
                <span>{f.path.split('/').pop() ?? f.path}</span>
                <span
                  role="button"
                  aria-label={`Close ${f.path.split('/').pop()}`}
                  className="ml-1 rounded p-0.5 "
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(f.path);
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Folder toggle button */}
          <div ref={explorerRef} className="relative shrink-0">
            <Drawer>
              <DrawerTrigger>

              </DrawerTrigger>
            </Drawer>
            <button
              type="button"
              aria-label="Toggle file explorer"
              aria-expanded={showExplorer}
              className="p-2 text-[var(--muted)] hover:text-[var(--text)]"
              onClick={() => setShowExplorer((v) => !v)}
            >
              {showExplorer ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
            </button>

            {showExplorer && (
              <div className="absolute right-0 top-full z-50 min-w-48 rounded-md border border-[var(--border)] bg-[var(--surface)] shadow-lg">
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]">
                  Files
                </div>
                <ul className="py-1">
                  {allFiles.length === 0 && (
                    <li className="px-3 py-2 text-xs text-[var(--muted)]">No files</li>
                  )}
                  {allFiles.map((f) => {
                    const filename = f.path.split('/').pop() ?? f.path;
                    const isOpen = openFilePaths.includes(f.path);
                    const isActive = f.path === activeFilePath;
                    return (
                      <li key={f.path}>
                        <button
                          type="button"
                          className={[
                            'flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left',
                            isActive
                              ? 'bg-[var(--border)] text-[var(--text)]'
                              : 'text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--text)]',
                          ].join(' ')}
                          onClick={() => {
                            openFile(f.path);
                            setShowExplorer(false);
                          }}
                        >
                          <FileCode className="h-3.5 w-3.5 shrink-0" />
                          <span className={isOpen ? 'font-medium' : ''}>{filename}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <TabsContent value={activeFilePath ?? ''} className="flex-1 overflow-y-auto">
          <div className="flex h-full w-full overflow-hidden bg-[var(--background)]">
            <div ref={editorRef} className="flex-1 h-full" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});
