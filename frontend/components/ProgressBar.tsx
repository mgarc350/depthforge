'use client';

interface Props {
  progress: number;
  message: string;
}

const STAGES = [
  { min: 0, max: 15, label: 'Removing background' },
  { min: 15, max: 40, label: 'Encoding image' },
  { min: 40, max: 75, label: 'Generating mesh' },
  { min: 75, max: 90, label: 'Applying textures' },
  { min: 90, max: 100, label: 'Exporting model' },
];

function getStage(progress: number) {
  return STAGES.find((s) => progress >= s.min && progress < s.max) ?? STAGES[STAGES.length - 1];
}

export default function ProgressBar({ progress, message }: Props) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const stage = getStage(clampedProgress);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-fg font-medium animate-progress-pulse">
          {message || stage.label}
        </span>
        <span className="text-accent font-mono tabular-nums text-xs">
          {clampedProgress}%
        </span>
      </div>

      <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{
            width: `${clampedProgress}%`,
            background: 'linear-gradient(90deg, #7c6fff, #a78bfa)',
          }}
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex gap-1 mt-1">
        {STAGES.map((s) => (
          <div
            key={s.min}
            className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
              clampedProgress >= s.min ? 'bg-accent' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <p className="text-xs text-muted">
        Processing on GPU — this usually takes 30–90 seconds.
      </p>
    </div>
  );
}
