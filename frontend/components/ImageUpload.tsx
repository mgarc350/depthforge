'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  image: File | null;
  onImageChange: (file: File | null) => void;
  label?: string;
  compact?: boolean;
}

export default function ImageUpload({ image, onImageChange, label, compact = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      onImageChange(file);
    },
    [onImageChange]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onPaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    },
    [handleFile]
  );

  useEffect(() => {
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [onPaste]);

  if (preview && image) {
    return (
      <div className={`relative group ${compact ? 'aspect-square' : 'aspect-video'} rounded-xl overflow-hidden bg-surface-2 border border-border`}>
        <img src={preview} alt="Uploaded" className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
          >
            Replace
          </button>
          <button
            onClick={() => onImageChange(null)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
          >
            Remove
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`
        relative ${compact ? 'aspect-square' : 'aspect-video'} rounded-xl border-2 border-dashed cursor-pointer
        flex flex-col items-center justify-center gap-3 transition-all duration-200
        ${isDragging
          ? 'border-accent bg-accent-dim scale-[0.99]'
          : 'border-border hover:border-accent/50 hover:bg-surface-2/50'
        }
      `}
    >
      <div className={`h-10 w-10 rounded-xl ${isDragging ? 'bg-accent' : 'bg-surface-2'} flex items-center justify-center transition-colors`}>
        <svg className={`h-5 w-5 ${isDragging ? 'text-white' : 'text-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      {!compact && (
        <>
          <div className="text-center">
            <p className="text-sm font-medium text-fg">
              {label || 'Drop image here, click, or paste'}
            </p>
            <p className="text-xs text-muted mt-1">PNG, JPG, WEBP up to 20MB</p>
          </div>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  );
}
