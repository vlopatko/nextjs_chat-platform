import { type ClassValue, clsx } from 'clsx'
import { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') {
    return path
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}}`
  }
  return `http:localhost:${process.env.PORT ?? 3000}${path}`
}

export function constructMetadata({
  title = 'DropDoc - the SaaS for students',
  description = 'DropDoc is an open-source software to make chatting to your PDF files easy.',
  image = '/thumbnail.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    icons,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: 'DropDoc - the SaaS for students',
        },
      ],
    },
    metadataBase: new URL('https://dropdocapp.vercel.app'),
    themeColor: '#ffffff',
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
