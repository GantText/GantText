import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, ViewUpdate } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

export type EditorProps = {
  value: string;
  onChange?: (value: string, update: ViewUpdate) => void;
  className?: string;
};

export default function Editor({ value, onChange, className }: EditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const startState = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        keymap.of([...defaultKeymap, ...historyKeymap] as const),
        history(),
        markdown(),
        oneDark,
        EditorView.updateListener.of((v) => {
          if (v.docChanged && onChange) {
            const doc = v.state.doc.toString();
            onChange(doc, v);
          }
        }),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({ state: startState, parent: containerRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } });
    }
  }, [value]);

  return <div ref={containerRef} className={className} />;
}
