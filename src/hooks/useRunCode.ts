import { useChallengeStore } from '@/stores/challengeStore';
import { useUIStore } from '@/stores/uiStore';
import { CONSOLE_RUNNING_LINE } from '@/lib/constants';
import { useEffect, useRef } from 'react';

interface UseRunCodeReturn {
  triggerRun: () => void;
}

export function useRunCode(): UseRunCodeReturn {
  const editorContent = useChallengeStore((state) => state.editorContent);
  const clearOutput = useUIStore((state) => state.clearOutput);
  const appendOutputLine = useUIStore((state) => state.appendOutputLine);
  const setConsoleActiveTab = useUIStore((state) => state.setConsoleActiveTab);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/pyodide.worker.tsx', import.meta.url),
      { type: "module"}
    )
    workerRef.current.postMessage({ type: 'init' });
    workerRef.current.onmessage = (event) => {
      const {type} = event.data;
      if (type === 'result') {
        const lines = event.data.stdout.split('\n');
        lines.forEach((line: string) => appendOutputLine(line));
      }

      if (type === 'error') {
        appendOutputLine(`Error: ${event.data.message}`);
      }
    };
    return () => workerRef.current?.terminate();

  }, []);

  const triggerRun = () => {
    clearOutput();
    appendOutputLine(CONSOLE_RUNNING_LINE);
    workerRef.current?.postMessage({ type: 'run', code: editorContent });
    setConsoleActiveTab('output');
  };

  return { triggerRun };
}
