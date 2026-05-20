'use client';

import { useState } from 'react';
import { getDownloadUrl } from '@/lib/api';
import type { ExportFormat } from '@/types';

const FORMATS: { format: ExportFormat; label: string; description: string }[] = [
  { format: 'glb', label: 'GLB', description: 'GLTF Binary — universal' },
  { format: 'obj', label: 'OBJ', description: 'Wavefront — wide compat' },
  { format: 'fbx', label: 'FBX', description: 'Autodesk — Maya/3ds Max' },
  { format: 'stl', label: 'STL', description: '3D printing ready' },
  { format: 'blend', label: 'BLEND', description: 'Blender native' },
];

interface Props {
  jobId: string;
  compact?: boolean;
}

export default function ExportButtons({ jobId, compact = false }: Props) {
  const [downloading, setDownloading] = useState<ExportFormat | null>(null);

  const handleDownload = async (format: ExportFormat) => {
    setDownloading(format);
    try {
      const url = getDownloadUrl(jobId, format);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `depthforge-${jobId.slice(0, 8)}.${format}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(null);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {FORMATS.map(({ format, label }) => (
          <button
            key={format}
            onClick={() => handleDownload(format)}
            disabled={downloading !== null}
            className={`text-xs px-2 py-1 rounded-lg border font-medium transition-all
              ${downloading === format
                ? 'bg-accent border-accent text-white'
                : 'bg-surface-2 border-border text-muted hover:border-accent/50 hover:text-fg'
              } disabled:opacity-50`}
          >
            {downloading === format ? '…' : label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Export</p>
      <div className="grid grid-cols-5 gap-2">
        {FORMATS.map(({ format, label, description }) => (
          <button
            key={format}
            onClick={() => handleDownload(format)}
            disabled={downloading !== null}
            title={description}
            className={`
              flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all
              ${downloading === format
                ? 'bg-accent border-accent text-white'
                : 'bg-surface-2 border-border text-muted hover:border-accent/40 hover:text-fg hover:bg-surface-2/80'
              } disabled:opacity-50 cursor-pointer
            `}
          >
            {downloading === format ? (
              <div className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
