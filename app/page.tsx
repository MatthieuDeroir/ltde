'use client';

import { useState } from 'react';
import { useInfiniteCapsules } from '@/core/api/capsules/capsules.queries';
import { CapsuleCard } from '@/components/capsules/CapsuleCard';
import { FeedFilters } from '@/components/capsules/FeedFilters';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteCapsules({
    status: 'PUBLISHED',
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  const allCapsules = data?.pages.flatMap((page) => page.capsules) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold">Souvenirs Partagés</h1>

      <FeedFilters selectedTags={selectedTags} onTagsChange={setSelectedTags} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allCapsules.map((capsule: any) => (
          <CapsuleCard key={capsule.id} capsule={capsule} />
        ))}
      </div>

      {allCapsules.length === 0 && (
        <p className="py-12 text-center text-slate-500">
          Aucun souvenir trouvé. Soyez le premier à en créer un !
        </p>
      )}

      {hasNextPage && (
        <div className="mt-8 text-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Chargement...' : 'Charger plus'}
          </Button>
        </div>
      )}
    </div>
  );
}
