import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'

export async function RequireAuth({
  children
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <>{children}</>
}