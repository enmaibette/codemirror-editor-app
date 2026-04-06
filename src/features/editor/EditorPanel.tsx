import { EditorSidebar } from './EditorSidebar';
import { useCodeMirror } from './useCodeMirror';

interface EditorPanelProps {
  value: string;
  onChange: (code: string) => void;
  showSidebar?: boolean;
  onFileClick?: () => void;
  onHintClick?: () => void;
}

export function EditorPanel({
  value,
  onChange,
  showSidebar = true,
  onFileClick,
  onHintClick,
}: EditorPanelProps) {
  const { containerRef } = useCodeMirror({
    initialDoc: value,
    onChange,
  });

  return (
    <div className="flex h-full w-full overflow-hidden bg-[var(--background)]">
      {showSidebar && <EditorSidebar onFileClick={onFileClick} onHintClick={onHintClick} />}
      <div ref={containerRef} className="flex-1 h-full" />
    </div>
  );
}
