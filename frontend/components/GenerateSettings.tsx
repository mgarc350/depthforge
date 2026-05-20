'use client';

import type { GenerateSettings, ModelType, Quality, Pose } from '@/types';

interface Props {
  settings: GenerateSettings;
  onChange: (settings: GenerateSettings) => void;
}

function SegmentControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; description?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            title={opt.description}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
              value === opt.value
                ? 'bg-accent border-accent text-white'
                : 'bg-surface-2 border-border text-muted hover:border-accent/50 hover:text-fg'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GenerateSettings({ settings, onChange }: Props) {
  return (
    <div className="space-y-4">
      <SegmentControl<ModelType>
        label="Model Type"
        value={settings.modelType}
        onChange={(v) => onChange({ ...settings, modelType: v })}
        options={[
          { value: 'standard', label: 'Standard', description: 'Full-detail mesh, best for characters and props' },
          { value: 'lowpoly', label: 'Low Poly', description: 'Stylized reduced mesh, ideal for games' },
        ]}
      />

      <SegmentControl<Quality>
        label="Quality"
        value={settings.quality}
        onChange={(v) => onChange({ ...settings, quality: v })}
        options={[
          { value: 'draft', label: 'Draft', description: 'Fast preview — 1 credit' },
          { value: 'standard', label: 'Standard', description: 'Balanced quality — 2 credits' },
          { value: '4k', label: '4K', description: 'Maximum resolution — 4 credits' },
        ]}
      />

      <SegmentControl<Pose>
        label="Pose Control"
        value={settings.pose}
        onChange={(v) => onChange({ ...settings, pose: v })}
        options={[
          { value: 'none', label: 'None', description: 'Keep original pose from image' },
          { value: 'a-pose', label: 'A-Pose', description: 'Arms at 45° — good for rigging' },
          { value: 't-pose', label: 'T-Pose', description: 'Arms horizontal — standard rigging pose' },
        ]}
      />

      <div className="bg-surface-2 rounded-lg px-3 py-2 text-xs text-muted flex items-center gap-2">
        <svg className="h-3.5 w-3.5 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Credit cost: {settings.quality === 'draft' ? 1 : settings.quality === 'standard' ? 2 : 4} credit{(settings.quality === '4k' ? 4 : settings.quality === 'standard' ? 2 : 1) !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
