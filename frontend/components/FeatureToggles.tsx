'use client';

import type { FeatureToggles } from '@/types';

interface Props {
  features: FeatureToggles;
  onChange: (features: FeatureToggles) => void;
}

const FEATURE_LIST: {
  key: keyof FeatureToggles;
  label: string;
  description: string;
  creditCost?: number;
}[] = [
  {
    key: 'backgroundRemoval',
    label: 'Background Removal',
    description: 'Auto-remove background before processing with rembg',
  },
  {
    key: 'imageEnhancement',
    label: 'Image Enhancement',
    description: 'Upscale and denoise input image for better results',
  },
  {
    key: 'pbrTextures',
    label: 'PBR Textures',
    description: 'Generate physically-based roughness, metallic, and normal maps',
    creditCost: 1,
  },
  {
    key: 'autoRemesh',
    label: 'Auto Remesh',
    description: 'Clean up topology for animation-ready mesh',
  },
  {
    key: 'autoSize',
    label: 'Auto Size',
    description: 'Scale model to real-world dimensions automatically',
  },
];

export default function FeatureToggles({ features, onChange }: Props) {
  const toggle = (key: keyof FeatureToggles) => {
    onChange({ ...features, [key]: !features[key] });
  };

  return (
    <div className="space-y-2.5">
      {FEATURE_LIST.map(({ key, label, description, creditCost }) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          className={`
            w-full flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all duration-150
            ${features[key]
              ? 'border-accent/40 bg-accent-dim'
              : 'border-border bg-surface-2 hover:border-border hover:bg-surface-2/80'
            }
          `}
        >
          <div className={`
            mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all
            ${features[key] ? 'bg-accent border-accent' : 'border-border bg-transparent'}
          `}>
            {features[key] && (
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${features[key] ? 'text-fg' : 'text-muted'}`}>
                {label}
              </span>
              {creditCost && (
                <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-medium">
                  +{creditCost}
                </span>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5 leading-snug">{description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
