import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CapsuleViewerProps {
  capsule: {
    id: string;
    title: string;
    content: string;
    coverImage?: string | null;
    publishedAt: Date | string | null;
    year?: number | null;
    location?: string | null;
    user: {
      displayName?: string | null;
      username: string;
      avatar?: string | null;
      bio?: string | null;
    };
    tags: Array<{
      tag: {
        id: string;
        name: string;
        color?: string | null;
      };
    }>;
    media: Array<{
      id: string;
      type: string;
      url: string;
      caption?: string | null;
    }>;
    _count: {
      likes: number;
      comments: number;
    };
    isLikedByUser: boolean;
  };
}

export function CapsuleViewer({ capsule }: CapsuleViewerProps) {
  return (
    <article className="mx-auto max-w-4xl">
      {/* Cover Image */}
      {capsule.coverImage && (
        <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
          <Image
            src={capsule.coverImage}
            alt={capsule.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{capsule.title}</h1>

        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            {capsule.user.avatar && (
              <Image
                src={capsule.user.avatar}
                alt={capsule.user.displayName || capsule.user.username}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span className="font-medium">
              {capsule.user.displayName || capsule.user.username}
            </span>
          </div>
          {capsule.publishedAt && (
            <>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(capsule.publishedAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </>
          )}
          {capsule.year && (
            <>
              <span>•</span>
              <span>{capsule.year}</span>
            </>
          )}
          {capsule.location && (
            <>
              <span>•</span>
              <span>📍 {capsule.location}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {capsule.tags.map(({ tag }) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color || '#64748b' }}
              className="text-white"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </header>

      <Separator className="my-8" />

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: capsule.content }}
      />

      {/* Media Gallery */}
      {capsule.media.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Médias</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {capsule.media.map((media) => (
              <div key={media.id} className="overflow-hidden rounded-lg">
                {media.type === 'IMAGE' && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={media.url}
                      alt={media.caption || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {media.type === 'VIDEO' && (
                  <video controls className="w-full">
                    <source src={media.url} />
                  </video>
                )}
                {media.type === 'AUDIO' && (
                  <audio controls className="w-full">
                    <source src={media.url} />
                  </audio>
                )}
                {media.caption && (
                  <p className="mt-2 text-sm text-slate-600">{media.caption}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <span className="text-lg font-medium">{capsule._count.likes}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="text-lg font-medium">{capsule._count.comments}</span>
        </div>
      </div>

      {/* Placeholder for Likes & Comments (v0.9.0) */}
      <div className="mt-8 rounded-lg bg-slate-50 p-6">
        <p className="text-center text-slate-500">
          Les likes et commentaires seront disponibles en v0.9.0
        </p>
      </div>
    </article>
  );
}
