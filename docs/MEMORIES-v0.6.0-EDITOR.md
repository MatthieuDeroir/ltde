# v0.6.0 - Éditeur TipTap

**Durée**: 7 jours | **Status**: 🔴 Not Started | **Prérequis**: v0.5.0 ✅

---

## 🎯 Objectif

Implémenter l'éditeur riche TipTap avec toolbar et fonctionnalités complètes.

**Livrables**:
- TipTap configuré avec extensions
- Toolbar basique/avancée
- Auto-save (30s)
- Preview mode
- Pages éditeur (/editor/new, /editor/[id])
- **Grand-père crée sa première capsule** ✨

---

## 📋 Checklist

### 1. Setup TipTap

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link
pnpm add @tiptap/extension-text-align @tiptap/extension-typography @tiptap/extension-placeholder
pnpm add @tiptap/extension-character-count @tiptap/extension-color @tiptap/extension-highlight
pnpm add @tiptap/extension-underline @tiptap/extension-table @tiptap/extension-table-row
pnpm add @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-youtube
```

**`src/components/editor/TipTapEditor.tsx`**
```typescript
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Commencez à écrire votre souvenir...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return <EditorContent editor={editor} className="prose prose-lg max-w-none" />;
}
```

- [ ] TipTap installé avec toutes extensions
- [ ] Composant `<TipTapEditor>` créé
- [ ] onChange callback fonctionnel

---

### 2. Toolbar Basique/Avancée

**`src/components/editor/EditorToolbar.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!editor) return null;

  return (
    <div className="sticky top-20 z-40 border-b bg-white p-4">
      {/* Mode Basique (toujours visible) */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="lg"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong> Gras
        </Button>
        <Button
          size="lg"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em> Italique
        </Button>
        <Button
          size="lg"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H Titre
        </Button>
        <Button size="lg" variant="outline">
          📷 Photo
        </Button>
        <Button size="lg" variant="default">
          💾 Enregistrer
        </Button>
      </div>

      {/* Toggle Mode Avancé */}
      <Button
        size="sm"
        variant="ghost"
        className="mt-2"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼' : '▶'} Options avancées
      </Button>

      {/* Mode Avancé (toggleable) */}
      {showAdvanced && (
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
          <Button
            variant={editor.isActive('underline') ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            Souligné
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            Gauche
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            Centre
          </Button>
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • Liste
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] Toolbar basique (5 boutons: Gras, Italique, Titre, Photo, Enregistrer)
- [ ] Toolbar avancée (toggleable)
- [ ] Boutons GROS (size="lg" = 60px)
- [ ] Labels + icônes

---

### 3. Sidebar Éditeur

**`src/components/editor/EditorSidebar.tsx`**
```typescript
'use client';

import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TagSelector } from '@/components/tags/TagSelector';

interface EditorSidebarProps {
  title: string;
  onTitleChange: (title: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function EditorSidebar({
  title,
  onTitleChange,
  selectedTags,
  onTagsChange,
}: EditorSidebarProps) {
  return (
    <aside className="w-80 border-l bg-slate-50 p-6">
      <h3 className="mb-4 text-xl font-bold">Paramètres</h3>

      <div className="space-y-6">
        {/* Titre */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Titre du souvenir *
          </label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Vacances en Bretagne 1975"
            className="h-14 text-lg"
          />
        </div>

        <Separator />

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium">Tags</label>
          <TagSelector selected={selectedTags} onChange={onTagsChange} />
        </div>

        <Separator />

        {/* Audio (v0.8.0) */}
        <div className="rounded-lg bg-white p-4">
          <p className="text-sm text-slate-500">
            📣 L'enregistrement audio sera disponible en v0.8.0
          </p>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] Sidebar fixe droite (w-80)
- [ ] Section titre (input 60px hauteur)
- [ ] Section tags (selector)
- [ ] Placeholder audio (v0.8.0)

---

### 4. Auto-save

**`src/hooks/useAutoSave.ts`**
```typescript
import { useEffect, useRef } from 'react';

export function useAutoSave(
  data: any,
  onSave: () => Promise<void>,
  delay: number = 30000 // 30 secondes
) {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onSave();
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, onSave, delay]);
}
```

**Indicateur Auto-save**:
```typescript
const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

useAutoSave(content, async () => {
  setSaveStatus('saving');
  await updateCapsule({ content });
  setSaveStatus('saved');
});

// Afficher dans header
<div className="text-sm">
  {saveStatus === 'saved' && '✅ Enregistré'}
  {saveStatus === 'saving' && '⏳ Enregistrement...'}
  {saveStatus === 'unsaved' && '⚠️ Modifications non enregistrées'}
</div>
```

- [ ] Hook `useAutoSave` créé
- [ ] Auto-save toutes les 30s
- [ ] Indicateur visible (Enregistré/Enregistrement.../Non enregistré)

---

### 5. Preview Mode

**`src/components/editor/PreviewModal.tsx`**
```typescript
'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CapsuleViewer } from '@/components/capsules/CapsuleViewer';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  capsule: any;
}

export function PreviewModal({ open, onClose, capsule }: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <CapsuleViewer capsule={capsule} />
      </DialogContent>
    </Dialog>
  );
}
```

Bouton Preview dans toolbar:
```typescript
<Button size="lg" variant="outline" onClick={() => setPreviewOpen(true)}>
  👁️ Aperçu
</Button>
```

- [ ] Modal preview avec `<CapsuleViewer>`
- [ ] Bouton "Aperçu" dans toolbar
- [ ] Affiche rendu final

---

### 6. Pages Éditeur

**`src/app/editor/new/page.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { useCreateCapsule } from '@/core/api/capsules/capsules.mutations';

export default function NewCapsulePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const createMutation = useCreateCapsule();

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    const capsule = await createMutation.mutateAsync({
      title,
      content,
      tagIds: selectedTags,
      status: 'DRAFT',
    });

    router.push(`/editor/${capsule.id}`);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <EditorToolbar onSave={handleSave} />
        <div className="p-8">
          <TipTapEditor content={content} onChange={setContent} />
        </div>
      </div>

      <EditorSidebar
        title={title}
        onTitleChange={setTitle}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />
    </div>
  );
}
```

**`src/app/editor/[id]/page.tsx`** (similaire avec useCapsule + useUpdateCapsule)

- [ ] Page `/editor/new` créée
- [ ] Page `/editor/[id]` créée
- [ ] Layout: Toolbar + Editor + Sidebar
- [ ] Mutations TanStack Query (create, update)

---

### 7. Mutations API

**`src/core/api/capsules/capsules.mutations.ts`**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export function useCreateCapsule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/capsules', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capsules'] });
    },
  });
}

export function useUpdateCapsule(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.put(`/capsules/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capsule', id] });
    },
  });
}
```

- [ ] `capsules.mutations.ts` créé
- [ ] `useCreateCapsule` hook
- [ ] `useUpdateCapsule` hook
- [ ] Invalidation cache

---

## ✅ Critères de Validation v0.6.0

### Tests Automatiques
```bash
pnpm test
pnpm lint
pnpm build
```

### Tests Manuels
- [ ] Toolbar basique fonctionne (Gras, Italique, Titre)
- [ ] Toggle mode avancé fonctionne
- [ ] Auto-save toutes les 30s (vérifier indicateur)
- [ ] Preview affiche rendu correct
- [ ] Créer nouvelle capsule → Sauvegarde draft
- [ ] Éditer capsule existante → Updates content
- [ ] Sidebar: Titre et tags sauvegardés

### **Validation Grand-Père** ✨
- [ ] Grand-père ouvre `/editor/new`
- [ ] Écrit un titre
- [ ] Tape du texte (min 3 paragraphes)
- [ ] Teste Gras, Italique, Titre
- [ ] Sauvegarde → Capsule créée
- [ ] **Grand-père crée sa première capsule complète**

---

## 📦 Commit & Tag

```bash
git checkout dev
git add .
git commit -m "feat(editor): implement TipTap rich text editor

- TipTap setup with extensions (StarterKit, Image, Link, etc.)
- Toolbar basic/advanced modes
- Auto-save every 30 seconds
- Preview modal
- Editor pages (/editor/new, /editor/[id])
- Editor sidebar (title, tags)
- TanStack Query mutations (create, update)

✅ Grand-père created first capsule ✨"

git checkout main
git merge dev
git tag -a v0.6.0 -m "Release v0.6.0 - Éditeur TipTap

✅ Rich text editor functional
✅ Auto-save implemented
✅ Preview mode
✅ Grand-père created first memory ✨
✅ Ready for v0.7.0 (Media Upload)"

git push origin main dev v0.6.0
```

---

## 🔄 Prochaines Étapes

➡️ **v0.7.0 - Upload Média & Bibliothèque**
- Setup Uploadthing
- Media uploader component
- Media library page
- Integration dans éditeur

---

**Version**: v0.6.0
**Durée**: 7 jours
**Prérequis**: v0.5.0 ✅
**Next**: v0.7.0 - Upload Média
