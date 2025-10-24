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
