import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CapsuleCardProps {
  capsule: {
    id: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    publishedAt: Date | string | null;
    year?: number | null;
    user: {
      displayName?: string | null;
      username: string;
    };
    tags: Array<{
      tag: {
        id: string;
        name: string;
        color?: string | null;
      };
    }>;
    _count: {
      likes: number;
      comments: number;
    };
  };
}

export function CapsuleCard({ capsule }: CapsuleCardProps) {
  return (
    <Link href={`/capsule/${capsule.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
        {capsule.coverImage && (
          <div className="relative h-48 w-full">
            <Image
              src={capsule.coverImage}
              alt={capsule.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardHeader>
          <CardTitle className="line-clamp-2">{capsule.title}</CardTitle>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{capsule.user.displayName || capsule.user.username}</span>
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
          </div>
        </CardHeader>

        <CardContent>
          {capsule.excerpt && (
            <p className="mb-4 line-clamp-3 text-sm text-slate-600">{capsule.excerpt}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {capsule.tags.slice(0, 3).map(({ tag }) => (
                <Badge
                  key={tag.id}
                  style={{ backgroundColor: tag.color || '#64748b' }}
                  className="text-white"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>❤️ {capsule._count.likes}</span>
              <span>💬 {capsule._count.comments}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
