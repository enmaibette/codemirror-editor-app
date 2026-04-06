import { useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { DescriptionPanel } from '@/features/description-panel/DescriptionPanel';
import { EditorPanel } from '@/features/editor/EditorPanel';
import { ConsolePanel } from '@/features/console/ConsolePanel';
import { useChallenge } from '@/hooks/useChallenge';
import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();

  const setActiveChallenge = useChallengeStore((state) => state.setActiveChallenge);
  const editorContent = useChallengeStore((state) => state.editorContent);
  const setEditorContent = useChallengeStore((state) => state.setEditorContent);

  const isLeftPanelOpen = useUIStore((state) => state.isLeftPanelOpen);
  const setLeftPanelOpen = useUIStore((state) => state.setLeftPanelOpen);
  const consoleActiveTab = useUIStore((state) => state.consoleActiveTab);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);
  const descriptionActiveTab = useUIStore((state) => state.descriptionActiveTab);
  const setDescriptionActiveTab = useUIStore((state) => state.setDescriptionActiveTab);
  const outputLines = useUIStore((state) => state.outputLines);
  const setConsolePanelOpen = useUIStore((state) => state.setConsolePanelOpen);
  const isConsolePanelOpen = useUIStore((state) => state.isConsolePanelOpen);

  const handleDescriptionClose = useCallback(() => setLeftPanelOpen(false), [setLeftPanelOpen]);

  const challenge = useChallenge(id);

  useEffect(() => {
    if (id && challenge) {
      setActiveChallenge(id);
    }
  }, [id, challenge, setActiveChallenge]);

  // Redirect to home if challenge not found
  if (!id || !challenge) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <SplitLayout
        isLeftPanelOpen={isLeftPanelOpen}
        onLeftPanelClose={() => setLeftPanelOpen(false)}
        onLeftPanelOpen={() => setLeftPanelOpen(true)}
        isConsolePanelOpen={isConsolePanelOpen}
        onConsolePanelClose={() => setConsolePanelOpen(false)}
        onConsolePanelOpen={() => setConsolePanelOpen(true)}
        descriptionPanel={
          <DescriptionPanel
            challenge={challenge}
            activeTab={descriptionActiveTab}
            onTabChange={setDescriptionActiveTab}
            onClose={handleDescriptionClose}
          />
        }
        editorPanel={
          <EditorPanel
            value={editorContent}
            onChange={setEditorContent}
            showSidebar={!isLeftPanelOpen}
            onFileClick={() => {
              setDescriptionActiveTab('description');
              setLeftPanelOpen(true);
            }}
            onHintClick={() => {
              setDescriptionActiveTab('hint');
              setLeftPanelOpen(true);
            }}
          />
        }
        consolePanel={
          <ConsolePanel
            activeTab={consoleActiveTab}
            onTabChange={setConsoleActiveTab}
            outputLines={outputLines}
            testCases={challenge.testCases}
            onClose={() => setConsolePanelOpen(!isConsolePanelOpen)}
            onOpen={() => setConsolePanelOpen(true)}
            isOpen={isConsolePanelOpen}
          />
        }
      />
    </div>
  );
}
