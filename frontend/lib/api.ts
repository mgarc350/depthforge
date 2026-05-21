import type { GenerateRequest, Job, ExportFormat } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function generateModel(
  images: { [slot: string]: File },
  request: GenerateRequest,
  authToken: string
): Promise<{ job_id: string }> {
  const formData = new FormData();

  Object.entries(images).forEach(([slot, file]) => {
    if (file) formData.append(`image_${slot}`, file);
  });

  formData.append('settings', JSON.stringify(request.settings));
  formData.append('features', JSON.stringify(request.features));
  formData.append('texture_prompt', request.texturePrompt);

  const res = await fetch(`${API_URL}/run`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Generation failed');
  }

  return res.json();
}

export async function pollStatus(jobId: string, authToken: string): Promise<Job> {
  const res = await fetch(`${API_URL}/status/${jobId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });

  if (!res.ok) throw new Error('Failed to fetch job status');
  return res.json();
}

export function getDownloadUrl(jobId: string, format: ExportFormat): string {
  return `${API_URL}/download/${jobId}/${format}`;
}
