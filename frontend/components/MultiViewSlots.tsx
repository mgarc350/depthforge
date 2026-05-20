'use client';

import ImageUpload from './ImageUpload';
import type { ViewSlot } from '@/types';

interface Props {
  slots: ViewSlot;
  onSlotsChange: (slots: ViewSlot) => void;
}

const SLOT_LABELS: { key: keyof ViewSlot; label: string; icon: string }[] = [
  { key: 'front', label: 'Front', icon: '↑' },
  { key: 'side', label: 'Side', icon: '→' },
  { key: 'back', label: 'Back', icon: '↓' },
  { key: 'top', label: 'Top', icon: '↗' },
];

export default function MultiViewSlots({ slots, onSlotsChange }: Props) {
  const update = (key: keyof ViewSlot, file: File | null) => {
    onSlotsChange({ ...slots, [key]: file });
  };

  const filledCount = Object.values(slots).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted">
          Additional views improve model accuracy. {filledCount}/4 slots filled.
        </p>
        {filledCount > 0 && (
          <button
            onClick={() => onSlotsChange({ front: null, side: null, back: null, top: null })}
            className="text-xs text-muted hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SLOT_LABELS.map(({ key, label }) => (
          <div key={key}>
            <p className="text-xs text-muted mb-1.5 font-medium">{label}</p>
            <ImageUpload
              image={slots[key]}
              onImageChange={(file) => update(key, file)}
              label={label}
              compact
            />
          </div>
        ))}
      </div>
    </div>
  );
}
