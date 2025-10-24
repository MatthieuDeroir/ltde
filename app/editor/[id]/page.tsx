'use client';

import { useState, useCallback, useEffect, use } from 'react';
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
import { useUpdateCapsule } from '@/core/api/capsules/capsules.mutations';
import { useCapsule } from '@/core/api/capsules/capsules.queries';
import { useTags } from '@/core/api/tags/tags.queries';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function EditCapsulePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { data: capsule, isLoading, error } = useCapsule(params.id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  const updateMutation = useUpdateCapsule(params.id);
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
      setSaveStatus('unsaved');
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 bg-white rounded-lg border-2 border-slate-200',
      },
    },
  });

  // Load capsule data when it's fetched
  useEffect(() => {
    if (capsule) {
      setTitle((capsule as any).title || '');
      setContent((capsule as any).content || '');
      setSelectedTags((capsule as any).tags?.map((t: any) => t.id) || []);
      if (editor && (capsule as any).content) {
        editor.commands.setContent((capsule as any).content);
      }
    }
  }, [capsule, editor]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      alert('⚠️ Le titre est obligatoire pour enregistrer votre souvenir');
      return;
    }

    try {
      setSaveStatus('saving');
      await updateMutation.mutateAsync({
        title,
        content,
        tagIds: selectedTags,
      });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving capsule:', error);
      alert('❌ Erreur lors de l\'enregistrement. Veuillez réessayer.');
      setSaveStatus('unsaved');
    }
  }, [title, content, selectedTags, updateMutation]);

  // Auto-save every 30 seconds
  useAutoSave({ title, content, selectedTags }, handleSave, 30000);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl text-slate-500">Chargement de votre souvenir...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-red-600">Erreur</h1>
          <p className="text-lg text-slate-600">Impossible de charger ce souvenir.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const selectedTagObjects = (Array.isArray(allTags) ? allTags.filter((tag: any) => selectedTags.includes(tag.id)) : []);

  return (
    <div className="flex min-h-screen flex-col">
      <EditorToolbar
        editor={editor}
        onSave={handleSave}
        onPreview={() => setPreviewOpen(true)}
        saveStatus={saveStatus}
      />

      <div className="flex flex-1">
        <div className="flex-1 p-8">
          <h1 className="mb-6 text-3xl font-bold text-slate-700">Éditer votre souvenir</h1>
          <TipTapEditor content={content} onChange={setContent} editable={true} />
        </div>

        <EditorSidebar
          title={title}
          onTitleChange={(newTitle) => {
            setTitle(newTitle);
            setSaveStatus('unsaved');
          }}
          selectedTags={selectedTags}
          onTagsChange={(newTags) => {
            setSelectedTags(newTags);
            setSaveStatus('unsaved');
          }}
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
