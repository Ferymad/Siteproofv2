import { redirect } from 'next/navigation'
import { createClient } from '../supabase/server'

export async function ProtectedProfile() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Fetch RLS-protected data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single()

  return (
    <div className="p-4">
      <h2>Profile</h2>
      <p>Welcome {profile?.full_name || user.email}</p>
    </div>
  )
}