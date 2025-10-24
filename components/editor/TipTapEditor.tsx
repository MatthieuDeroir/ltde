'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function TipTapEditor({ content, onChange, editable = true }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline hover:text-indigo-700',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Placeholder.configure({
        placeholder: 'Commencez à écrire votre souvenir...',
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      CharacterCount,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 bg-white rounded-lg border-2 border-slate-200',
      },
    },
  });

  // Update content when prop changes (for external updates)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="p-8 text-slate-500">Chargement de l'éditeur...</div>;
  }

  return (
    <div className="relative">
      <EditorContent editor={editor} />
      {editor && (
        <div className="mt-4 text-sm text-slate-500">
          {editor.storage.characterCount.characters()} caractères · {editor.storage.characterCount.words()} mots
        </div>
      )}
    </div>
  );
}

// Export editor instance type for toolbar
export type { Editor } from '@tiptap/react';
