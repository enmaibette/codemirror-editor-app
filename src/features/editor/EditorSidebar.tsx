import { FileText, Lightbulb } from 'lucide-react';

interface EditorSidebarProps {
  onFileClick?: () => void;
  onHintClick?: () => void;
}

export function EditorSidebar({ onFileClick, onHintClick }: EditorSidebarProps) {
  return (
    <div
      className="
        flex flex-col items-center gap-4 py-3
        w-10 shrink-0
        bg-[var(--surface)]
        border-r border-[var(--border)]
      "
    >
      <button
        type="button"
        onClick={onFileClick}
        aria-label="Files"
        className="
          p-1.5 rounded
          text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)]
          transition-colors
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]
        "
      >
        <FileText className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onHintClick}
        aria-label="Hints"
        className="
          p-1.5 rounded
          text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)]
          transition-colors
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]
        "
      >
        <Lightbulb className="h-5 w-5" />
      </button>
    </div>
  );
}
