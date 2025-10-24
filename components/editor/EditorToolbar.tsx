'use client';

import { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Heading2,
  Image as ImageIcon,
  Save,
  Eye,
  List,
  AlignLeft,
  AlignCenter,
  Underline as UnderlineIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  onSave?: () => void;
  onPreview?: () => void;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
}

export function EditorToolbar({ editor, onSave, onPreview, saveStatus = 'saved' }: EditorToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!editor) return null;

  return (
    <div className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        {/* Save Status */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">
            {saveStatus === 'saved' && <span className="text-green-600">✅ Enregistré</span>}
            {saveStatus === 'saving' && <span className="text-indigo-600">⏳ Enregistrement...</span>}
            {saveStatus === 'unsaved' && <span className="text-yellow-600">⚠️ Modifications non enregistrées</span>}
          </div>
        </div>

        {/* Mode Basique (toujours visible) */}
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Gras (Ctrl+B)"
          >
            <Bold className="mr-2 h-5 w-5" />
            Gras
          </Button>

          <Button
            size="lg"
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italique (Ctrl+I)"
          >
            <Italic className="mr-2 h-5 w-5" />
            Italique
          </Button>

          <Button
            size="lg"
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Titre"
          >
            <Heading2 className="mr-2 h-5 w-5" />
            Titre
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const url = window.prompt('URL de l\'image:');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            title="Insérer une image"
          >
            <ImageIcon className="mr-2 h-5 w-5" />
            Photo
          </Button>

          {onPreview && (
            <Button size="lg" variant="outline" onClick={onPreview} title="Aperçu">
              <Eye className="mr-2 h-5 w-5" />
              Aperçu
            </Button>
          )}

          {onSave && (
            <Button size="lg" variant="default" onClick={onSave} title="Enregistrer maintenant">
              <Save className="mr-2 h-5 w-5" />
              Enregistrer
            </Button>
          )}
        </div>

        {/* Toggle Mode Avancé */}
        <Button
          size="sm"
          variant="ghost"
          className="mt-3 text-base"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
          {showAdvanced ? 'Masquer' : 'Afficher'} les options avancées
        </Button>

        {/* Mode Avancé (toggleable) */}
        {showAdvanced && (
          <div className="mt-4 flex flex-wrap gap-3 border-t pt-4">
            <Button
              variant={editor.isActive('underline') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Souligné"
            >
              <UnderlineIcon className="mr-2 h-4 w-4" />
              Souligné
            </Button>

            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              title="Aligner à gauche"
            >
              <AlignLeft className="mr-2 h-4 w-4" />
              Gauche
            </Button>

            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              title="Centrer"
            >
              <AlignCenter className="mr-2 h-4 w-4" />
              Centre
            </Button>

            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              title="Liste à puces"
            >
              <List className="mr-2 h-4 w-4" />
              Liste
            </Button>

            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'outline'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Liste numérotée"
            >
              <List className="mr-2 h-4 w-4" />
              Liste 1,2,3
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
