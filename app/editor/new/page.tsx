'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor } from '@tiptap/react';
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
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { PreviewModal } from '@/components/editor/PreviewModal';
import { useCreateCapsule } from '@/core/api/capsules/capsules.mutations';
import { useTags } from '@/core/api/tags/tags.queries';

export default function NewCapsulePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const createMutation = useCreateCapsule();
  const { data: allTags } = useTags();

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
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 bg-white rounded-lg border-2 border-slate-200',
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert('⚠️ Le titre est obligatoire pour enregistrer votre souvenir');
      return;
    }

    try {
      const capsule = await createMutation.mutateAsync({
        title,
        content,
        tagIds: selectedTags,
        status: 'DRAFT',
      });

      alert('✅ Votre souvenir a été enregistré comme brouillon!');
      router.push(`/editor/${(capsule as any).id}`);
    } catch (error) {
      console.error('Error saving capsule:', error);
      alert('❌ Erreur lors de l\'enregistrement. Veuillez réessayer.');
    }
  }, [title, content, selectedTags, createMutation, router]);

  const selectedTagObjects = (Array.isArray(allTags) ? allTags.filter((tag: any) => selectedTags.includes(tag.id)) : []);

  return (
    <div className="flex min-h-screen flex-col">
      <EditorToolbar
        editor={editor}
        onSave={handleSave}
        onPreview={() => setPreviewOpen(true)}
        saveStatus="unsaved"
      />

      <div className="flex flex-1">
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-700">Créer un nouveau souvenir</h1>
          <TipTapEditor content={content} onChange={setContent} editable={true} />
        </div>

        <EditorSidebar
          title={title}
          onTitleChange={setTitle}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
      </div>

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title}
        content={content}
        tags={selectedTagObjects}
      />
    </div>
  );
}
