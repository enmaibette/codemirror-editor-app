import { createHighlighter, type Highlighter } from 'shiki';

let highlighterInstance: Highlighter | null = null;
let initPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return Promise.resolve(highlighterInstance);
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = createHighlighter({
    themes: ['dark-plus'],
    langs: ['python'],
  }).then((hl) => {
    highlighterInstance = hl;
    return hl;
  });

  return initPromise;
}

export async function highlight(code: string, lang: string = 'python'): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: 'dark-plus',
  });
}
