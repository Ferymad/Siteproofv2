import type { NextRequest } from 'next/server'
import { updateSession } from '@/examples/middleware/auth.middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

// exclude assets
export const config = {
  matcher: ['/((?!_next|.*\\..*|api/health).*)'],
}
