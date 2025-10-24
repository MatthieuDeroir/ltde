import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
          Capsules Mémoires
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-lg font-medium hover:text-indigo-600 transition-colors">
            Accueil
          </Link>
          <Link href="/login">
            <Button variant="outline" size="default">
              Connexion
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
