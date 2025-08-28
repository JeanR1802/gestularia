// FILE: /app/layout.tsx
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gestularia – Crea tu Propio Sitio Web en Minutos',
  description:
    'Gestularia es una plataforma para crear y editar tu página web fácilmente sin necesidad de programar.',
  keywords: [
    'gestularia',
    'constructor web',
    'editor no-code',
    'crear página web',
    'crear sitio sin programar',
    'diseño web fácil',
  ],
  openGraph: {
    title: 'Gestularia – Crea tu Propio Sitio Web en Minutos',
    description:
      'Plataforma no-code para diseñar y publicar tu sitio web en minutos.',
    url: 'https://gestularia.com',
    siteName: 'Gestularia',
    images: [
      {
        url: 'https://gestularia.com/og-image.jpg', // 🔹 crea una imagen 1200x630px y súbela
        width: 1200,
        height: 630,
        alt: 'Gestularia – Crea tu Web sin Código',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gestularia – Crea tu Propio Sitio Web en Minutos',
    description:
      'Diseña y publica tu página web fácilmente sin escribir código.',
    images: ['https://gestularia.com/og-image.jpg'],
    creator: '@gestularia', // si tienes Twitter, cámbialo
  },
  alternates: {
    canonical: 'https://gestularia.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
