'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import ImageUpload from '@/components/ImageUpload';
import MultiViewSlots from '@/components/MultiViewSlots';
import TexturePrompt from '@/components/TexturePrompt';
import GenerateSettings from '@/components/GenerateSettings';
import FeatureToggles from '@/components/FeatureToggles';
import ProgressBar from '@/components/ProgressBar';
import ModelViewer from '@/components/ModelViewer';
import ExportButtons from '@/components/ExportButtons';
import LegalCheckboxes from '@/components/LegalCheckboxes';
import { generateModel, pollStatus } from '@/lib/api';
import { isAdmin } from '@/lib/admin';
import type { ViewSlot, GenerateSettings as ISettings, FeatureToggles as IFeatures, Job } from '@/types';

const DEFAULT_SETTINGS: ISettings = {
  modelType: 'standard',
  quality: 'standard',
  pose: 'none',
};

const DEFAULT_FEATURES: IFeatures = {
  imageEnhancement: true,
  pbrTextures: false,
  autoRemesh: true,
  backgroundRemoval: true,
  autoSize: true,
};

export default function GeneratePage() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const admin = isAdmin(user?.primaryEmailAddress?.emailAddress);

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [viewSlots, setViewSlots] = useState<ViewSlot>({ front: null, side: null, back: null, top: null });
  const [texturePrompt, setTexturePrompt] = useState('');
  const [settings, setSettings] = useState<ISettings>(DEFAULT_SETTINGS);
  const [features, setFeatures] = useState<IFeatures>(DEFAULT_FEATURES);
  const [legalAccepted, setLegalAccepted] = useState({ terms: false, privacy: false });

  const [isGenerating, setIsGenerating] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasImage = primaryImage !== null || viewSlots.front !== null;
  const legalOk = legalAccepted.terms && legalAccepted.privacy;
  // Admins skip all credit checks; legal agreements still required
  const canGenerate = hasImage && legalOk && !isGenerating;

  const startGeneration = useCallback(async () => {
    if (!canGenerate) return;

    setError(null);
    setIsGenerating(true);
    setJob(null);
    setModelUrl(null);

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const images: { [key: string]: File } = {};
      if (primaryImage) images['front'] = primaryImage;
      if (viewSlots.front) images['front'] = viewSlots.front;
      if (viewSlots.side) images['side'] = viewSlots.side;
      if (viewSlots.back) images['back'] = viewSlots.back;
      if (viewSlots.top) images['top'] = viewSlots.top;

      const { job_id } = await generateModel(images, { settings, features, texturePrompt }, token);

      let pollInterval = setInterval(async () => {
        try {
          const status = await pollStatus(job_id, token!);
          setJob(status);

          if (status.status === 'done') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            if (status.model_url) setModelUrl(status.model_url);
          } else if (status.status === 'error') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            setError(status.message || 'Generation failed');
          }
        } catch {
          clearInterval(pollInterval);
          setIsGenerating(false);
          setError('Lost connection to server');
        }
      }, 2000);
    } catch (e: unknown) {
      setIsGenerating(false);
      setError(e instanceof Error ? e.message : 'An error occurred');
    }
  }, [canGenerate, primaryImage, viewSlots, settings, features, texturePrompt, getToken]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-fg">Generate 3D Model</h1>
          {admin && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-dim border border-accent/40 text-accent text-sm font-semibold">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Admin · Unlimited
            </span>
          )}
        </div>
        <p className="text-muted mt-1">Upload an image and let TripoSR transform it into a 3D model.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Primary image upload */}
          <div className="card">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Primary Image</h2>
            <ImageUpload image={primaryImage} onImageChange={setPrimaryImage} />
          </div>

          {/* Multi-view slots */}
          <div className="card">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
              Multi-View Slots <span className="text-muted font-normal normal-case">(optional)</span>
            </h2>
            <MultiViewSlots slots={viewSlots} onSlotsChange={setViewSlots} />
          </div>

          {/* Texture prompt */}
          <div className="card">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Texture Description</h2>
            <TexturePrompt value={texturePrompt} onChange={setTexturePrompt} />
          </div>

          {/* Settings */}
          <div className="card">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Model Settings</h2>
            <GenerateSettings settings={settings} onChange={setSettings} />
          </div>

          {/* Feature toggles */}
          <div className="card">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Features</h2>
            <FeatureToggles features={features} onChange={setFeatures} />
          </div>

          {/* Legal checkboxes */}
          <div className="card">
            <LegalCheckboxes accepted={legalAccepted} onChange={setLegalAccepted} />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Generate button */}
          {isSignedIn ? (
            <button
              onClick={startGeneration}
              disabled={!canGenerate}
              className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate 3D Model
                </>
              )}
            </button>
          ) : (
            <a href="/sign-in" className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2">
              Sign in to Generate
            </a>
          )}
        </div>

        {/* Right column — viewer */}
        <div className="space-y-5">
          <div className="card sticky top-24">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">3D Preview</h2>

            {isGenerating && (
              <div className="mb-4">
                <ProgressBar progress={job?.progress ?? 0} message={job?.message ?? 'Initializing…'} />
              </div>
            )}

            <div className="aspect-square rounded-xl overflow-hidden bg-surface-2 border border-border">
              {modelUrl ? (
                <ModelViewer modelUrl={modelUrl} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <svg className="h-16 w-16 text-border mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-muted text-sm">
                    {isGenerating ? 'Generating your 3D model…' : 'Your 3D model will appear here'}
                  </p>
                </div>
              )}
            </div>

            {modelUrl && job && (
              <div className="mt-4">
                <ExportButtons jobId={job.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
