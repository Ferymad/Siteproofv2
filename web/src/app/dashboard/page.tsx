import { RequireAuth } from '@/examples/components/RequireAuth'

export default async function Page() {
  return (
    <RequireAuth>
      <main><h1>Dashboard</h1></main>
    </RequireAuth>
  )
}