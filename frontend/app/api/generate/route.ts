import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY!;
const RUNPOD_ENDPOINT_ID = process.env.RUNPOD_ENDPOINT_ID!;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();

  let imageFile: File | null = null;
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('image_') && value instanceof File) {
      imageFile = value;
      break;
    }
  }

  if (!imageFile) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const settings = JSON.parse((formData.get('settings') as string) || '{}');
  const features = JSON.parse((formData.get('features') as string) || '{}');

  const arrayBuffer = await imageFile.arrayBuffer();
  const image_b64 = Buffer.from(arrayBuffer).toString('base64');

  const job_id = crypto.randomUUID();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from('jobs').insert({
    id: job_id,
    user_id: userId,
    status: 'pending',
    progress: 0,
    message: 'Queued',
  });

  const runpodRes = await fetch(
    `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/run`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({
        input: { image_b64, job_id, settings, features },
      }),
    }
  );

  if (!runpodRes.ok) {
    const err = await runpodRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: err.error || 'RunPod submission failed' },
      { status: 502 }
    );
  }

  return NextResponse.json({ job_id });
}
