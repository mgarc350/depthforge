'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserJobs } from '@/lib/supabase';
import ExportButtons from '@/components/ExportButtons';

interface JobRecord {
  id: string;
  status: string;
  created_at: string;
  credits_used: number;
  model_url: string | null;
  thumbnail_url: string | null;
  settings: Record<string, unknown>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    done: 'bg-green-500/15 text-green-400 border-green-500/30',
    processing: 'bg-accent-dim text-accent border-accent/30',
    queued: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[status] ?? map.queued}`}>
      {status}
    </span>
  );
}

export default function MyModelsPage() {
  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user) return;
    getUserJobs(user.id).then((data) => {
      setJobs(data as JobRecord[]);
      setLoading(false);
    });
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-surface-2 rounded-xl mb-4" />
              <div className="h-4 bg-surface-2 rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface-2 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign in to view your models</h1>
        <a href="/sign-in" className="btn-primary inline-block">Sign In</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fg">My Models</h1>
          <p className="text-muted mt-1">{jobs.length} model{jobs.length !== 1 ? 's' : ''} generated</p>
        </div>
        <a href="/" className="btn-primary flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Model
        </a>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-24">
          <svg className="h-20 w-20 text-border mx-auto mb-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No models yet</h2>
          <p className="text-muted mb-6">Generate your first 3D model from an image.</p>
          <a href="/" className="btn-primary inline-block">Get Started</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:border-accent/40 transition-colors group">
              <div className="aspect-square bg-surface-2 rounded-xl mb-4 overflow-hidden relative">
                {job.thumbnail_url ? (
                  <img
                    src={job.thumbnail_url}
                    alt="Model thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <svg className="h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge status={job.status} />
                </div>
              </div>

              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-fg truncate">
                    Model {job.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(job.created_at).toLocaleDateString()} · {job.credits_used} credit{job.credits_used !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {job.status === 'done' && (
                <ExportButtons jobId={job.id} compact />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
