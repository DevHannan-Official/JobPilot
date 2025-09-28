import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'JobPilot | Find a Job | Hire a seeker',
  keywords: [
    // full stack developer tags
  ],
  description: 'Find a job that suits your interest & skills with JobPilot',
  authors: [
    {
      name: 'JobPilot',
      url: 'https://jobpilot.vercel.app',
    },
    {
      name: 'Hannan Developer',
      url: 'https://github.com/DevHannan-Official',
    },
  ],
  creator: 'Hannan Developer',
  openGraph: {
    title: 'JobPilot | Find a Job | Hire a seeker',
    description: 'Find a job that suits your interest & skills with JobPilot',
    url: 'https://jobpilot.vercel.app',
    siteName: 'JobPilot',
    images: [
      {
        url: 'https://jobpilot.vercel.app/seo/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JobPilot Open Graph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobPilot | Find a Job | Hire a seeker',
    description: 'Find a job that suits your interest & skills with JobPilot',
    images: ['https://jobpilot.vercel.app/seo/og-image.png'],
  },
  icons: {
    icon: '/seo/favicon.ico',
    apple: '/seo/apple-touch-icon.png',
    shortcut: '/seo/favicon-32x32.png',
  },
  manifest: '/seo/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // TODO: Add the google verification
    google: '',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JobPilot',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
