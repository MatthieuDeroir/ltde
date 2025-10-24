'use client';

import { useState } from 'react';
import { useMedia } from '@/core/api/media/media.queries';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaUploader } from '@/components/media/MediaUploader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Image as ImageIcon, Video, Music, Grid3X3 } from 'lucide-react';
import { MediaType } from '@prisma/client';

export default function MediaLibraryPage() {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedType, setSelectedType] = useState<MediaType | 'ALL'>('ALL');

  const { data: media, isLoading, refetch } = useMedia({
    type: selectedType === 'ALL' ? undefined : selectedType,
    limit: 100,
  });

  const mediaArray = Array.isArray(media) ? media : [];

  const stats = {
    total: mediaArray.length,
    images: mediaArray.filter((m: any) => m.type === 'IMAGE').length,
    videos: mediaArray.filter((m: any) => m.type === 'VIDEO').length,
    audios: mediaArray.filter((m: any) => m.type === 'AUDIO').length,
  };

  const handleUploadComplete = () => {
    setShowUploader(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-slate-900">Bibliothèque de médias</h1>
            <Button size="lg" onClick={() => setShowUploader(!showUploader)}>
              <Upload className="mr-2 h-5 w-5" />
              {showUploader ? 'Masquer l\'uploader' : 'Ajouter des médias'}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4">
            <Badge
              variant={selectedType === 'ALL' ? 'default' : 'outline'}
              className="cursor-pointer text-base px-4 py-2"
              onClick={() => setSelectedType('ALL')}
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              Tous ({stats.total})
            </Badge>
            <Badge
              variant={selectedType === 'IMAGE' ? 'default' : 'outline'}
              className="cursor-pointer text-base px-4 py-2"
              onClick={() => setSelectedType('IMAGE')}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Images ({stats.images})
            </Badge>
            <Badge
              variant={selectedType === 'VIDEO' ? 'default' : 'outline'}
              className="cursor-pointer text-base px-4 py-2"
              onClick={() => setSelectedType('VIDEO')}
            >
              <Video className="mr-2 h-4 w-4" />
              Vidéos ({stats.videos})
            </Badge>
            <Badge
              variant={selectedType === 'AUDIO' ? 'default' : 'outline'}
              className="cursor-pointer text-base px-4 py-2"
              onClick={() => setSelectedType('AUDIO')}
            >
              <Music className="mr-2 h-4 w-4" />
              Audio ({stats.audios})
            </Badge>
          </div>
        </div>

        {/* Uploader */}
        {showUploader && (
          <div className="mb-8 p-6 bg-white rounded-lg border-2 border-slate-200">
            <h2 className="text-2xl font-bold mb-6">Uploader de nouveaux fichiers</h2>
            <MediaUploader onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {/* Media Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-2xl text-slate-500">Chargement...</div>
          </div>
        ) : mediaArray.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <ImageIcon className="h-20 w-20 text-slate-300 mb-4" />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">Aucun média</h3>
            <p className="text-slate-500 mb-6">Commencez par uploader vos premières photos, vidéos ou audios</p>
            <Button size="lg" onClick={() => setShowUploader(true)}>
              <Upload className="mr-2 h-5 w-5" />
              Ajouter des médias
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mediaArray.map((item: any) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
