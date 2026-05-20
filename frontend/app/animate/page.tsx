export default function AnimatePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-fg">Animate</h1>
        <p className="text-muted mt-1">Bring your 3D models to life with AI-driven animation.</p>
      </div>

      <div className="card flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-2xl bg-accent-dim flex items-center justify-center">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            SOON
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-3">Animation Coming Soon</h2>
        <p className="text-muted max-w-md mb-8 text-sm leading-relaxed">
          We're building AI-powered animation tools that will let you apply walk cycles, idles,
          and custom motion to any 3D model generated on DepthForge. Sign up to be notified
          when it launches.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            className="input-field w-64"
          />
          <button className="btn-primary whitespace-nowrap">
            Notify Me
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
          {[
            { icon: '🚶', label: 'Walk Cycles', desc: 'Idle, walk, run, jump' },
            { icon: '🎭', label: 'Expressions', desc: 'Facial animation rigs' },
            { icon: '🎬', label: 'Custom Clips', desc: 'Describe your animation' },
          ].map((f) => (
            <div key={f.label} className="bg-surface-2 rounded-xl p-4 border border-border text-left opacity-60">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm font-medium text-fg">{f.label}</p>
              <p className="text-xs text-muted mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
