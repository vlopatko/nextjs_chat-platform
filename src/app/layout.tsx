import cn from 'classnames'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import NavBar from '@/components/NavBar'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

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
          <NavBar />
          {children}
        </body>
      </Providers>
    </html>
  )
}
