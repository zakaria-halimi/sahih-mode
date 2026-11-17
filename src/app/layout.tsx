import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import './globals.css'

/* ─── Metadata ───────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  metadataBase: new URL('https://sahihmode.ma'),
  title: {
    default: 'SAHIH MODE — Mode Luxe & Authentique',
    template: 'SAHIH MODE | %s',
  },
  description:
    'Découvrez SAHIH MODE, votre destination mode de luxe au Maroc. Collections exclusives, pièces soigneusement sélectionnées, livraison rapide.',
  keywords: ['mode', 'luxe', 'Maroc', 'boutique', 'vêtements', 'fashion'],
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://sahihmode.ma',
    siteName: 'SAHIH MODE',
    title: 'SAHIH MODE — Mode Luxe & Authentique',
    description:
      'Découvrez SAHIH MODE, votre destination mode de luxe au Maroc. Collections exclusives, pièces soigneusement sélectionnées.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SAHIH MODE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAHIH MODE — Mode Luxe & Authentique',
    description:
      'Découvrez SAHIH MODE, votre destination mode de luxe au Maroc.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

/* ─── Root layout ────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans min-h-screen flex flex-col bg-white text-black antialiased">
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#000',
              color: '#fff',
              borderRadius: '0',
              fontSize: '13px',
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-inter)',
              padding: '14px 20px',
            },
            success: {
              iconTheme: { primary: '#fff', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#fff', secondary: '#000' },
            },
          }}
        />
      </body>
    </html>
  )
}
