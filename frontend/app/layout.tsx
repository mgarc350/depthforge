import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'DepthForge — AI 3D Model Generation',
  description:
    'Transform images into stunning 3D models instantly with DepthForge. Export GLB, OBJ, FBX, STL, and more.',
  keywords: ['3D model', 'AI', 'image to 3D', 'TripoSR', 'GLB', 'OBJ'],
  openGraph: {
    title: 'DepthForge',
    description: 'AI-powered image-to-3D model generation',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="bg-bg text-fg min-h-screen antialiased">
          <Navbar />
          <main className="pt-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
