import { useState, useEffect } from 'react';
import { highlight } from '@/utils/shiki';

interface ShikiCodeBlockProps {
  code: string;
  lang?: string;
}

export function ShikiCodeBlock({ code, lang = 'python' }: ShikiCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    highlight(code, lang)
      .then((result) => {
        if (!cancelled) {
          setHtml(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          // Fallback to plain pre block on error
          setHtml(null);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (isLoading) {
    return (
      <div className="rounded-md bg-(--elevated) p-4 animate-pulse">
        <div className="h-3 bg-(--border) rounded w-3/4 mb-2" />
        <div className="h-3 bg-(--border) rounded w-1/2 mb-2" />
        <div className="h-3 bg-(--border) rounded w-2/3" />
      </div>
    );
  }

  if (!html) {
    // Fallback plain code block
    return (
      <pre className="shiki rounded-md overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="rounded-md overflow-x-auto text-sm"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
