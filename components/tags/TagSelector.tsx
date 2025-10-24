'use client';

import { useTags } from '@/core/api/tags/tags.queries';
import { Badge } from '@/components/ui/badge';

interface TagSelectorProps {
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagSelector({ selected, onChange }: TagSelectorProps) {
  const { data: tags, isLoading } = useTags();

  if (isLoading) {
    return <div className="text-sm text-slate-500">Chargement des tags...</div>;
  }

  if (!Array.isArray(tags) || tags.length === 0) {
    return (
      <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        Aucun tag disponible. Créez-en dans la section admin.
      </div>
    );
  }

  const toggleTag = (tagId: string) => {
    if (selected.includes(tagId)) {
      onChange(selected.filter((id) => id !== tagId));
    } else {
      onChange([...selected, tagId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Array.isArray(tags) && tags.map((tag: any) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => toggleTag(tag.id)}
          className="cursor-pointer transition-transform hover:scale-105"
        >
          <Badge variant={selected.includes(tag.id) ? 'default' : 'outline'} className="cursor-pointer">
            {tag.name}
          </Badge>
        </button>
      ))}
    </div>
  );
}
