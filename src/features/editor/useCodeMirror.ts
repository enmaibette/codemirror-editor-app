import { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { buildExtensions } from '@/lib/codemirrorExtensions.ts';

interface UseCodeMirrorOptions {
  initialDoc: string;
  onChange: (value: string) => void;
}

export function useCodeMirror({ initialDoc, onChange }: UseCodeMirrorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const lastDocRef = useRef(initialDoc);

  // Keep the callback ref current without re-running the main effect
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current) return;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: buildExtensions((value) => onChangeRef.current(value)),
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    lastDocRef.current = initialDoc;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only initialize once - do not depend on initialDoc
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update document when initialDoc changes (challenge switch)
  useEffect(() => {
    const view = viewRef.current;
    if (!view || initialDoc === lastDocRef.current) return;

    const currentDoc = view.state.doc.toString();
    // Only update if content is different (challenge switch, not user typing)
    if (currentDoc !== initialDoc) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: initialDoc,
        },
      });
      lastDocRef.current = initialDoc;
    }
  }, [initialDoc]);

  return { containerRef };
}
