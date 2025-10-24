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

export function EditorSidebar({ title, onTitleChange, selectedTags, onTagsChange }: EditorSidebarProps) {
  return (
    <aside className="w-96 border-l bg-slate-50 p-6">
      <h3 className="mb-6 text-2xl font-bold">Paramètres</h3>

      <div className="space-y-6">
        {/* Titre */}
        <div>
          <label className="mb-2 block text-base font-medium">Titre du souvenir *</label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Vacances en Bretagne 1975"
            className="text-lg"
          />
          <p className="mt-2 text-sm text-slate-500">Le titre apparaîtra en haut de votre souvenir</p>
        </div>

        <Separator />

        {/* Tags */}
        <div>
          <label className="mb-2 block text-base font-medium">Tags</label>
          <TagSelector selected={selectedTags} onChange={onTagsChange} />
          <p className="mt-2 text-sm text-slate-500">
            Sélectionnez un ou plusieurs thèmes pour classer votre souvenir
          </p>
        </div>

        <Separator />

        {/* Info Médias (v0.7.0) */}
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-4">
          <h4 className="mb-2 font-semibold text-slate-700">📸 Photos et vidéos</h4>
          <p className="text-sm text-slate-500">
            L'ajout de médias sera disponible dans la prochaine version (v0.7.0)
          </p>
        </div>

        {/* Info Audio (v0.8.0) */}
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-4">
          <h4 className="mb-2 font-semibold text-slate-700">🎙️ Enregistrement audio</h4>
          <p className="text-sm text-slate-500">
            L'enregistrement de votre voix sera disponible en version v0.8.0
          </p>
        </div>
      </div>
    </aside>
  );
}
