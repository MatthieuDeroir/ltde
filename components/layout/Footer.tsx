export function Footer() {
  return (
    <footer className="mt-auto border-t bg-slate-50 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-slate-600">
        <p>&copy; {new Date().getFullYear()} Capsules Mémoires. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
