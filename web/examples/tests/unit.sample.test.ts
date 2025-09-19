import { describe, it, expect, beforeEach, vi } from 'vitest'
import { signIn, signUp, signOut } from '../auth/server-actions'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('../supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Authentication Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should sign in with valid credentials', async () => {
    const { createClient } = await import('../supabase/server')
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: '123', email: 'test@example.com' } },
          error: null,
        }),
      },
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'password123')

    await signIn(formData)

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })

    const { redirect } = await import('next/navigation')
    const { revalidatePath } = await import('next/cache')
    expect(revalidatePath).toHaveBeenCalledWith('/', 'layout')
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should redirect to error page on sign in failure', async () => {
    const { createClient } = await import('../supabase/server')
    const mockSupabase = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Invalid credentials' },
        }),
      },
    }
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const formData = new FormData()
    formData.set('email', 'test@example.com')
    formData.set('password', 'wrongpassword')

    await signIn(formData)

    const { redirect } = await import('next/navigation')
    expect(redirect).toHaveBeenCalledWith('/error')
  })
})