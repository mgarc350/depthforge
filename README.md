# DepthForge

AI-powered image-to-3D model generation platform using TripoSR (MIT licensed).

## Stack

- **Frontend**: Next.js 14 + Tailwind CSS → Vercel
- **Backend**: FastAPI + TripoSR → RunPod GPU Serverless
- **Database**: Supabase
- **Auth**: Clerk
- **Payments**: Stripe

## Quick Start

### Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload
```

## Credit Packs

| Pack    | Credits | Price |
|---------|---------|-------|
| Starter | 10      | $3    |
| Pro     | 50      | $12   |
| Studio  | 200     | $40   |

## Export Formats

GLB · OBJ · FBX · STL · BLEND

## License

MIT — see [LICENSE](./LICENSE). Uses TripoSR (MIT licensed by Stability AI & Tripo AI).
