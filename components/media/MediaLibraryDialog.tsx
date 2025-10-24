'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaCard } from './MediaCard';
import { MediaUploader } from './MediaUploader';
import { useMedia } from '@/core/api/media/media.queries';
import { Upload, Image as ImageIcon, Video, Music, Grid3X3 } from 'lucide-react';
import { MediaType } from '@prisma/client';

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: { id: string; url: string; type: string }) => void;
  filter?: 'image' | 'video' | 'audio' | 'all';
}

export function MediaLibraryDialog({ open, onClose, onSelect, filter = 'all' }: MediaLibraryDialogProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaType | 'ALL'>(
    filter === 'all' ? 'ALL' : filter.toUpperCase() as MediaType
  );

  const { data: media, isLoading, refetch } = useMedia({
    type: selectedType === 'ALL' ? undefined : selectedType,
    limit: 100,
  });

  const mediaArray = Array.isArray(media) ? media : [];

  const filteredMedia =
    filter === 'all'
      ? mediaArray
      : mediaArray.filter((m: any) => m.type === filter.toUpperCase());

  const stats = {
    total: mediaArray.length,
    images: mediaArray.filter((m: any) => m.type === 'IMAGE').length,
    videos: mediaArray.filter((m: any) => m.type === 'VIDEO').length,
    audios: mediaArray.filter((m: any) => m.type === 'AUDIO').length,
  };

  const handleUploadComplete = (files: Array<{ url: string; name: string; type: string }>) => {
    setShowUploader(false);
    refetch();
    if (files.length > 0) {
      onSelect({ id: '', url: files[0].url, type: files[0].type });
      onClose();
    }
  };

  const handleSelect = (media: any) => {
    onSelect({ id: media.id, url: media.url, type: media.type });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">Bibliothèque de médias</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge
                variant={selectedType === 'ALL' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedType('ALL')}
              >
                <Grid3X3 className="mr-1 h-3 w-3" />
                Tous ({stats.total})
              </Badge>
              <Badge
                variant={selectedType === 'IMAGE' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedType('IMAGE')}
              >
                <ImageIcon className="mr-1 h-3 w-3" />
                Images ({stats.images})
              </Badge>
              <Badge
                variant={selectedType === 'VIDEO' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedType('VIDEO')}
              >
                <Video className="mr-1 h-3 w-3" />
                Vidéos ({stats.videos})
              </Badge>
              <Badge
                variant={selectedType === 'AUDIO' ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1"
                onClick={() => setSelectedType('AUDIO')}
              >
                <Music className="mr-1 h-3 w-3" />
                Audio ({stats.audios})
              </Badge>
            </div>

            <Button onClick={() => setShowUploader(!showUploader)} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              {showUploader ? 'Masquer' : 'Upload'}
            </Button>
          </div>

          {/* Uploader */}
          {showUploader && (
            <div className="p-4 bg-slate-50 rounded-lg border">
              <MediaUploader onUploadComplete={handleUploadComplete} accept={filter} />
            </div>
          )}

          {/* Media Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-slate-500">Chargement...</div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
              <ImageIcon className="h-16 w-16 text-slate-300 mb-3" />
              <p className="text-slate-500 mb-4">Aucun média disponible</p>
              <Button onClick={() => setShowUploader(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Uploader des fichiers
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item: any) => (
                <MediaCard key={item.id} media={item} onSelect={handleSelect} selectable />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
