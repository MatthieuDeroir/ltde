'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing';
import { Button } from '@/components/ui/button';
import { Upload, X, Video, Music } from 'lucide-react';

interface MediaUploaderProps {
  onUploadComplete?: (files: Array<{ url: string; name: string; type: string }>) => void;
  maxFiles?: number;
  accept?: 'image' | 'video' | 'audio' | 'all';
}

export function MediaUploader({ onUploadComplete, maxFiles = 10, accept = 'all' }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([]);

  const { startUpload: startImageUpload } = useUploadThing("imageUploader");
  const { startUpload: startVideoUpload } = useUploadThing("videoUploader");
  const { startUpload: startAudioUpload } = useUploadThing("audioUploader");

  const getAcceptConfig = (): Record<string, string[]> => {
    switch (accept) {
      case 'image':
        return { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] };
      case 'video':
        return { 'video/*': ['.mp4', '.webm', '.mov'] };
      case 'audio':
        return { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'] };
      default:
        return {
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          'video/*': ['.mp4', '.webm', '.mov'],
          'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
        };
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPreviews = acceptedFiles.map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: getAcceptConfig(),
  });

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev];
      if (newPreviews[index].preview) {
        URL.revokeObjectURL(newPreviews[index].preview);
      }
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const imageFiles = previews.filter((p) => p.file.type.startsWith('image/')).map((p) => p.file);
      const videoFiles = previews.filter((p) => p.file.type.startsWith('video/')).map((p) => p.file);
      const audioFiles = previews.filter((p) => p.file.type.startsWith('audio/')).map((p) => p.file);

      const results = [];

      if (imageFiles.length > 0) {
        const imageRes = await startImageUpload(imageFiles);
        results.push(...(imageRes || []).map((r) => ({ url: r.url, name: r.name, type: 'image' })));
      }

      if (videoFiles.length > 0) {
        const videoRes = await startVideoUpload(videoFiles);
        results.push(...(videoRes || []).map((r) => ({ url: r.url, name: r.name, type: 'video' })));
      }

      if (audioFiles.length > 0) {
        const audioRes = await startAudioUpload(audioFiles);
        results.push(...(audioRes || []).map((r) => ({ url: r.url, name: r.name, type: 'audio' })));
      }

      setProgress(100);
      onUploadComplete?.(results);

      // Clear previews
      previews.forEach((p) => {
        if (p.preview) URL.revokeObjectURL(p.preview);
      });
      setPreviews([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Erreur lors de l\'upload. Veuillez réessayer.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-16 w-16 text-slate-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-indigo-600 font-medium">Déposez les fichiers ici...</p>
        ) : (
          <div>
            <p className="text-lg font-medium text-slate-700 mb-2">
              Glissez-déposez vos fichiers ici, ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-slate-500">
              {accept === 'image' && 'Images seulement (PNG, JPG, GIF, WebP) - Max 10MB'}
              {accept === 'video' && 'Vidéos seulement (MP4, WebM, MOV) - Max 100MB'}
              {accept === 'audio' && 'Audio seulement (MP3, WAV, OGG, M4A) - Max 50MB'}
              {accept === 'all' && 'Images (10MB), Vidéos (100MB), Audio (50MB)'}
            </p>
          </div>
        )}
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{previews.length} fichier(s) sélectionné(s)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200">
                  {preview.preview ? (
                    <img src={preview.preview} alt={preview.file.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {preview.file.type.startsWith('video/') && <Video className="h-12 w-12 text-slate-400" />}
                      {preview.file.type.startsWith('audio/') && <Music className="h-12 w-12 text-slate-400" />}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Supprimer"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-1 text-sm text-slate-600 truncate">{preview.file.name}</p>
                <p className="text-xs text-slate-500">{(preview.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleUpload} disabled={uploading} size="lg" className="flex-1">
              {uploading ? `Upload en cours... ${progress}%` : `Uploader ${previews.length} fichier(s)`}
            </Button>
            <Button onClick={() => setPreviews([])} variant="outline" size="lg" disabled={uploading}>
              Annuler
            </Button>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
