'use client';

const MAX_CHARS = 600;

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TexturePrompt({ value, onChange }: Props) {
  const remaining = MAX_CHARS - value.length;
  const isNearLimit = remaining < 60;
  const isAtLimit = remaining <= 0;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= MAX_CHARS) onChange(e.target.value);
        }}
        placeholder="Describe the texture and material of the object… e.g. 'weathered dark oak wood with iron fittings, slightly worn edges'"
        rows={4}
        className="input-field resize-none text-sm leading-relaxed"
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted">
          Detailed texture descriptions improve PBR material quality.
        </p>
        <span className={`text-xs font-mono tabular-nums ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-muted'}`}>
          {remaining}
        </span>
      </div>
    </div>
  );
}
