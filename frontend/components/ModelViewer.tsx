'use client';

import { Suspense, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ThreeViewer = dynamic(() => import('./ThreeViewerInner'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-xs text-muted">Loading viewer…</p>
      </div>
    </div>
  ),
});

interface Props {
  modelUrl: string;
}

export default function ModelViewer({ modelUrl }: Props) {
  return (
    <div className="h-full w-full relative">
      <ThreeViewer modelUrl={modelUrl} />
      <div className="absolute bottom-3 right-3 text-[10px] text-muted/60 bg-bg/50 px-2 py-1 rounded backdrop-blur-sm">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
