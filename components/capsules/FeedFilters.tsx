'use client';

import { Badge } from '@/components/ui/badge';
import { useTags } from '@/core/api/tags/tags.queries';

interface FeedFiltersProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function FeedFilters({ selectedTags, onTagsChange }: FeedFiltersProps) {
  const { data: tags } = useTags();

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagsChange(selectedTags.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-sm font-medium text-slate-700">Filtrer par tags :</h3>
      <div className="flex flex-wrap gap-2">
        {Array.isArray(tags) && tags.map((tag: any) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => toggleTag(tag.id)}
            style={
              selectedTags.includes(tag.id)
                ? { backgroundColor: tag.color || '#64748b', color: 'white' }
                : {}
            }
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
