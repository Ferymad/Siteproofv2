import { signIn } from '@/examples/auth/server-actions'

export default function Page() {
  return (
    <main>
      <h1>Login</h1>
      <form action={signIn}>
        <input name="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <button type="submit">Sign in</button>
      </form>
    </main>
  )
}