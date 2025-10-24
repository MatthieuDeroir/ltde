'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  tags?: any[];
}

export function PreviewModal({ open, onClose, title, content, tags = [] }: PreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">{title || 'Sans titre'}</DialogTitle>
        </DialogHeader>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Content Preview */}
        <div className="prose prose-lg max-w-none py-6" dangerouslySetInnerHTML={{ __html: content }} />

        {/* Empty State */}
        {!content && (
          <div className="py-12 text-center text-slate-500">
            <p className="text-lg">Votre souvenir apparaîtra ici...</p>
            <p className="mt-2 text-sm">Commencez à écrire dans l'éditeur pour voir l'aperçu</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
