# v0.4.0 - Feed Public & Capsule Viewer

**Date de début**: TBD
**Date de fin**: TBD (Durée: 5 jours)
**Status**: 🔴 Not Started
**Prérequis**: v0.3.0 ✅

---

## 🎯 Objectif

Créer les interfaces publiques de lecture : Feed des capsules et Viewer détaillé.

**Livrables**:
- ✅ Composants UI de base (Button, Card, Input, etc.)
- ✅ Page Feed avec pagination infinie
- ✅ Page Capsule Viewer avec médias
- ✅ TanStack Query hooks
- ✅ Navigation responsive

---

## 📋 Checklist Détaillée

### 1. Composants UI de Base (Radix UI)

```bash
# Installer TanStack Query
pnpm add @tanstack/react-query
pnpm add @tanstack/react-query-devtools
```

**`src/app/providers.tsx`** (Query Client Provider)
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**`src/app/layout.tsx`** (Update)
```typescript
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### Button Component
**`src/components/ui/button.tsx`**
```typescript
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
        outline: 'border border-slate-300 bg-white hover:bg-slate-50',
        ghost: 'hover:bg-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### Card Component
**`src/components/ui/card.tsx`**
```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-white shadow-sm', className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
```

#### Autres Composants UI
Créer également :
- [ ] `input.tsx` - Input text
- [ ] `textarea.tsx` - Textarea
- [ ] `badge.tsx` - Badge pour tags
- [ ] `dialog.tsx` - Modal (Radix Dialog)
- [ ] `tooltip.tsx` - Tooltip (Radix Tooltip)
- [ ] `separator.tsx` - Divider (Radix Separator)

#### Checklist Composants UI
- [ ] TanStack Query installé
- [ ] Providers setup (QueryClientProvider)
- [ ] `<Button>` créé (variants: default, secondary, outline, ghost, danger)
- [ ] `<Card>` créé
- [ ] `<Input>` créé
- [ ] `<Textarea>` créé
- [ ] `<Badge>` créé
- [ ] `<Dialog>` créé (Radix)
- [ ] `<Tooltip>` créé (Radix)
- [ ] `<Separator>` créé (Radix)

---

### 2. TanStack Query Hooks

**`src/core/api/capsules/capsules.queries.ts`**
```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';
import type { CapsuleStatus } from '@prisma/client';

export interface CapsuleFilters {
  status?: CapsuleStatus;
  tags?: string[];
  search?: string;
  limit?: number;
}

export function useCapsules(filters: CapsuleFilters = {}) {
  return useQuery({
    queryKey: ['capsules', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.tags) filters.tags.forEach((tag) => params.append('tags', tag));
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());

      return apiClient.get<{
        capsules: any[];
        nextCursor: string | null;
      }>(`/capsules?${params.toString()}`);
    },
  });
}

export function useInfiniteCapsules(filters: CapsuleFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['capsules', 'infinite', filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.tags) filters.tags.forEach((tag) => params.append('tags', tag));
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (pageParam) params.append('cursor', pageParam);

      return apiClient.get<{
        capsules: any[];
        nextCursor: string | null;
      }>(`/capsules?${params.toString()}`);
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}

export function useCapsule(id: string) {
  return useQuery({
    queryKey: ['capsule', id],
    queryFn: () => apiClient.get(`/capsules/${id}`),
    enabled: !!id,
  });
}
```

**`src/core/api/tags/tags.queries.ts`**
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/api/client';

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiClient.get('/tags'),
  });
}
```

#### Checklist TanStack Query
- [ ] `capsules.queries.ts` créé
- [ ] `useCapsules` hook
- [ ] `useInfiniteCapsules` hook (pagination infinie)
- [ ] `useCapsule` hook (single)
- [ ] `tags.queries.ts` créé
- [ ] `useTags` hook

---

### 3. Layout & Navigation

**`src/components/layout/Header.tsx`**
```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Capsules Mémoires
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium hover:text-indigo-600">
            Accueil
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

**`src/components/layout/Footer.tsx`**
```typescript
export function Footer() {
  return (
    <footer className="mt-auto border-t bg-slate-50 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-slate-600">
        <p>&copy; {new Date().getFullYear()} Capsules Mémoires. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
```

**`src/app/layout.tsx`** (Update avec Header/Footer)
```typescript
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
```

#### Checklist Layout
- [ ] `<Header>` créé (logo + nav + login)
- [ ] `<Footer>` créé
- [ ] Layout mis à jour (Header + Main + Footer)
- [ ] Sticky header (top-0)

---

### 4. Feed Public (`/`)

**`src/components/capsules/CapsuleCard.tsx`**
```typescript
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
    excerpt?: string;
    coverImage?: string;
    publishedAt: Date;
    year?: number;
    user: {
      displayName?: string;
      username: string;
    };
    tags: Array<{
      tag: {
        id: string;
        name: string;
        color?: string;
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
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(capsule.publishedAt), {
                addSuffix: true,
                locale: fr,
              })}
            </span>
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
```

**`src/components/capsules/FeedFilters.tsx`**
```typescript
'use client';

import { useState } from 'react';
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
        {tags?.map((tag: any) => (
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
```

**`src/app/page.tsx`** (Feed avec pagination infinie)
```typescript
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
```

```bash
# Installer date-fns pour formatage dates
pnpm add date-fns
```

#### Checklist Feed
- [ ] date-fns installé
- [ ] `<CapsuleCard>` créé (cover, titre, excerpt, tags, stats)
- [ ] `<FeedFilters>` créé (tags sélectionnables)
- [ ] Page `/` créée
- [ ] Pagination infinie fonctionne
- [ ] Filtres tags fonctionnent
- [ ] Grid responsive (1/2/3 colonnes)
- [ ] Loading states

---

### 5. Capsule Viewer (`/capsule/[id]`)

**`src/components/capsules/CapsuleViewer.tsx`**
```typescript
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
    coverImage?: string;
    publishedAt: Date;
    year?: number;
    location?: string;
    user: {
      displayName?: string;
      username: string;
      avatar?: string;
      bio?: string;
    };
    tags: Array<{
      tag: {
        id: string;
        name: string;
        color?: string;
      };
    }>;
    media: Array<{
      id: string;
      type: string;
      url: string;
      caption?: string;
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
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(capsule.publishedAt), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
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
```

**`src/app/capsule/[id]/page.tsx`**
```typescript
import { useCapsule } from '@/core/api/capsules/capsules.queries';
import { CapsuleViewer } from '@/components/capsules/CapsuleViewer';

export default function CapsulePage({ params }: { params: { id: string } }) {
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
      <CapsuleViewer capsule={capsule} />
    </div>
  );
}
```

#### Checklist Capsule Viewer
- [ ] `<CapsuleViewer>` créé
- [ ] Page `/capsule/[id]` créée
- [ ] Cover image hero
- [ ] Metadata (auteur, date, année, lieu)
- [ ] Tags badges
- [ ] Contenu HTML riche (dangerouslySetInnerHTML)
- [ ] Galerie médias (images/vidéos/audio)
- [ ] Players HTML5 (video, audio)
- [ ] Stats (likes, comments)
- [ ] Loading & error states

---

### 6. Styles Prose (Tailwind Typography)

```bash
# Installer Tailwind Typography pour prose
pnpm add @tailwindcss/typography
```

**`tailwind.config.ts`** (Update)
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

#### Checklist
- [ ] @tailwindcss/typography installé
- [ ] Plugin ajouté à tailwind.config
- [ ] Classe `prose` appliquée au contenu

---

### 7. Tests Composants

**`src/components/ui/__tests__/button.test.tsx`**
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '../button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-slate-200');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });
});
```

**Tests similaires pour**:
- [ ] `card.test.tsx`
- [ ] `badge.test.tsx`
- [ ] `CapsuleCard.test.tsx`

#### Checklist Tests
- [ ] Tests Button
- [ ] Tests Card
- [ ] Tests Badge
- [ ] Tests CapsuleCard
- [ ] Tests Feed (filtres)

---

## ✅ Critères de Validation v0.4.0

### Tests Automatiques
```bash
pnpm test                          # ✅ Tous passent
pnpm lint                          # ✅ 0 warnings
pnpm type-check                    # ✅ 0 errors
pnpm build                         # ✅ Succès
```

### Tests Manuels
- [ ] Feed affiche capsules publiées
- [ ] Pagination infinie : Cliquer "Charger plus" → Nouvelles capsules
- [ ] Filtres tags : Sélectionner tag → Capsules filtrées
- [ ] Click capsule → Ouvre viewer
- [ ] Capsule viewer affiche cover, titre, contenu, tags
- [ ] Médias affichés (images, vidéos, audio)
- [ ] Players vidéo/audio fonctionnent
- [ ] Responsive mobile (grid 1 colonne)
- [ ] Responsive tablet (grid 2 colonnes)
- [ ] Responsive desktop (grid 3 colonnes)

### Performance
```bash
# Lighthouse audit
pnpm build && pnpm start
# Ouvrir http://localhost:3000
# DevTools → Lighthouse → Run audit
```

- [ ] Performance score > 80
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 80

---

## 📦 Commit & Tag Release

```bash
git checkout dev
git add .
git commit -m "feat(ui): implement feed and capsule viewer

- UI components (Button, Card, Badge, Input, Dialog, Tooltip)
- TanStack Query hooks (useCapsules, useInfiniteCapsules, useCapsule)
- Feed page with infinite scroll
- Capsule viewer with media gallery
- Responsive layout (Header, Footer)
- Filters by tags
- HTML5 media players (video, audio)

✅ All tests passing
✅ Responsive design
✅ Lighthouse > 80"

git checkout main
git merge dev
git tag -a v0.4.0 -m "Release v0.4.0 - Feed Public & Capsule Viewer

✅ Feed with infinite pagination
✅ Capsule viewer complete
✅ Responsive navigation
✅ TanStack Query setup
✅ UI components library
✅ Ready for v0.5.0 (Design System)"

git push origin main dev v0.4.0
```

---

## 🔄 Prochaines Étapes

➡️ **v0.5.0 - Design System & UX Senior-Friendly**
- Design tokens (colors, typography, spacing)
- Tailwind config senior-friendly
- Typographie 18px+ partout
- Boutons 60px hauteur
- Contrastes WCAG AAA

---

**Version**: v0.4.0
**Status**: 🔴 Not Started
**Durée estimée**: 5 jours
**Prérequis**: v0.3.0 ✅
**Next**: v0.5.0 - Design System & UX Senior-Friendly
