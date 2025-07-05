// middleware.js
import { NextResponse } from 'next/server';

export function middleware() {
  return new NextResponse('Unauthorized: Token tidak valid.', { status: 401 });
}

// Konfigurasi ini memastikan middleware berjalan untuk semua request
export const config = {
  matcher: '/:path*', // Ini akan mencocokkan semua path, termasuk ke Vercel Function Anda
};