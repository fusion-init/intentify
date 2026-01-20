'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from "react";
import Link from 'next/link';
import { LayoutDashboard, Home } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
        <QueryClientProvider client={queryClient}>
          <nav className="border-b bg-white sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
                Intentify
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  <Home className="w-4 h-4" /> Analyzer
                </Link>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              </div>
            </div>
          </nav>
          <main>
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
