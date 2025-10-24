'use client';

import { useCapsule } from '@/core/api/capsules/capsules.queries';
import { CapsuleViewer } from '@/components/capsules/CapsuleViewer';
import { use } from 'react';

export default function CapsulePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { data: capsule, isLoading, error } = useCapsule(params.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !capsule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Capsule non trouvée</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CapsuleViewer capsule={capsule as any} />
    </div>
  );
}
