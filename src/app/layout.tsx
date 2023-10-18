import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import NavBar from '@/components/NavBar'
import Providers from '@/components/Providers'

import 'react-loading-skeleton/dist/skeleton.css'
import 'simplebar-react/dist/simplebar.min.css'
import { Toaster } from '@/components/ui/toaster'

import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import { cn, constructMetadata } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            'grainy min-h-screen font-sans antialiased',
            inter.className
          )}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Toaster />
          <NavBar />
          {children}
        </body>
      </Providers>
    </html>
  )
}
