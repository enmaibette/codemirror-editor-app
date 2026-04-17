import { keymap, lineNumbers, EditorView } from "@codemirror/view";
import { defaultKeymap, historyKeymap, history } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState, Extension } from "@codemirror/state";

export function buildExtensions(onChange: (value: string) => void): Extension[] {
  return [
    lineNumbers(),
    history(),
    python(),
    autocompletion(),
    oneDark,
    keymap.of([...defaultKeymap, ...historyKeymap]),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        onChange(update.state.doc.toString());
      }
    }),
    EditorState.tabSize.of(4),
    indentUnit.of('    '),
    EditorView.theme({
      "&": { height: "100%", background: "#1E1E1E" },
      ".cm-scroller": { overflow: "auto" },
      ".cm-content": { padding: "12px 0" },
    }),
  ];
}
