import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_FORMATS = new Set(['glb', 'obj', 'stl', 'fbx', 'blend']);

const CONTENT_TYPES: Record<string, string> = {
  glb: 'model/gltf-binary',
  obj: 'text/plain',
  stl: 'model/stl',
  fbx: 'application/octet-stream',
  blend: 'application/octet-stream',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string; format: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { jobId, format } = await params;

  if (!ALLOWED_FORMATS.has(format)) {
    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: job, error } = await supabase
    .from('jobs')
    .select('status, model_url')
    .eq('id', jobId)
    .eq('user_id', userId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.status !== 'done' || !job.model_url) {
    return NextResponse.json({ error: 'Model not ready' }, { status: 400 });
  }

  if (format !== 'glb') {
    return NextResponse.json(
      { error: 'Only GLB downloads are supported via this route. Convert locally from the downloaded GLB.' },
      { status: 501 }
    );
  }

  const glbRes = await fetch(job.model_url);
  if (!glbRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch model from storage' }, { status: 502 });
  }

  return new NextResponse(glbRes.body, {
    headers: {
      'Content-Type': CONTENT_TYPES.glb,
      'Content-Disposition': `attachment; filename="depthforge_${jobId.slice(0, 8)}.glb"`,
    },
  });
}
