import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';
import { CONSOLE_RUNNING_LINE, CONSOLE_EMPTY_PLACEHOLDER } from '@/lib/constants';

interface UseRunCodeReturn {
  triggerRun: () => void;
}

/** Mock: prints editor content to console. No actual code execution. */
export function useRunCode(): UseRunCodeReturn {
  const editorContent = useChallengeStore((state) => state.editorContent);
  const clearOutput = useUIStore((state) => state.clearOutput);
  const appendOutputLine = useUIStore((state) => state.appendOutputLine);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);

  const triggerRun = () => {
    clearOutput();
    appendOutputLine(CONSOLE_RUNNING_LINE);
    const lines = editorContent.split('\n');
    lines.forEach((line) => {
      appendOutputLine(`  ${line}`);
    });
    appendOutputLine(CONSOLE_EMPTY_PLACEHOLDER);
    setConsoleActiveTab('output');
  };

  return { triggerRun };
}
