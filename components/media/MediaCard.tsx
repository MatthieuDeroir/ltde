'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Check, Image as ImageIcon, Video, Music } from 'lucide-react';
import { useDeleteMedia } from '@/core/api/media/media.mutations';

interface MediaCardProps {
  media: {
    id: string;
    type: 'IMAGE' | 'VIDEO' | 'AUDIO';
    url: string;
    filename: string;
    size: number;
    caption?: string;
    createdAt: string;
  };
  onSelect?: (media: any) => void;
  selectable?: boolean;
}

export function MediaCard({ media, onSelect, selectable = false }: MediaCardProps) {
  const [copied, setCopied] = useState(false);
  const deleteMutation = useDeleteMedia();

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) return;

    try {
      await deleteMutation.mutateAsync(media.id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const getMediaIcon = () => {
    switch (media.type) {
      case 'IMAGE':
        return <ImageIcon className="h-8 w-8 text-slate-400" />;
      case 'VIDEO':
        return <Video className="h-8 w-8 text-slate-400" />;
      case 'AUDIO':
        return <Music className="h-8 w-8 text-slate-400" />;
    }
  };

  return (
    <div
      className={`group relative rounded-lg overflow-hidden border-2 border-slate-200 bg-white hover:border-indigo-600 transition-all ${
        selectable ? 'cursor-pointer' : ''
      }`}
      onClick={() => selectable && onSelect?.(media)}
    >
      {/* Media Preview */}
      <div className="aspect-square bg-slate-100 flex items-center justify-center">
        {media.type === 'IMAGE' ? (
          <img src={media.url} alt={media.caption || media.filename} className="w-full h-full object-cover" />
        ) : (
          getMediaIcon()
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={media.type === 'IMAGE' ? 'default' : media.type === 'VIDEO' ? 'secondary' : 'outline'}>
            {media.type}
          </Badge>
          <span className="text-xs text-slate-500">{(media.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
        <p className="text-sm font-medium text-slate-700 truncate mb-1">{media.filename}</p>
        {media.caption && <p className="text-xs text-slate-500 line-clamp-2">{media.caption}</p>}
      </div>

      {/* Actions (shown on hover) */}
      {!selectable && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleCopyUrl} title="Copier l'URL">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copié' : 'Copier URL'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      )}
    </div>
  );
}
