# Next.js + Supabase + Vercel Examples Directory Implementation Plan

## Recent Updates (2025-09-19)
**Validated and applied critical fixes**:
- ✅ **Supabase Environment Variables**: Updated all references from `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (official new standard)
- ✅ **Next.js Import Sources**: Confirmed `redirect` from `'next/navigation'` and `revalidatePath` from `'next/cache'` are correct
- ✅ **Testing Dependencies**: Removed deprecated `@testing-library/react-hooks`, added `vite-tsconfig-paths` for proper path resolution
- ✅ **Test Mocking**: Fixed import mocks to use correct sources (`next/navigation` for redirect, `next/cache` for revalidatePath)
- ✅ **Vitest Configuration**: Added `tsconfigPaths()` plugin for TypeScript path resolution

## Overview
Seed a comprehensive `web/examples/` directory with production-ready patterns for Context Engineering to reference when implementing features in a Next.js + Supabase + Vercel MVP. These examples will serve as the authoritative patterns for AI coding assistants to follow.

## Current State Analysis
Based on research from `thoughts/shared/research/2025-09-19_1939_examples_seed.md`:
- Fresh Next.js 15.5.3 project exists at `web/` with minimal setup
- No Supabase, Zod, or testing dependencies installed
- TypeScript configured but no path mappings for examples
- Context Engineering requires concrete examples for pattern matching (README.md:238-265)

## Desired End State
A fully populated `web/examples/` directory containing:
- Working Supabase SSR client implementations
- Authentication patterns with server actions
- Zod validation schemas with `safeParse`
- Test scaffolds for Vitest and Playwright
- Database migrations and RLS policies
- CI/CD configuration for GitHub Actions

Verification: All examples should be syntactically correct, type-safe, and demonstrate best practices that PRPs can copy directly.

### Key Discoveries:
- Examples must be under `web/examples/` with TypeScript path mapping (research:555-599)
- Cookie handling must swallow errors in Server Components (research:102-109)
- Use `safeParse` with `result.success` branching, not `parse` with try/catch (research:184-197)
- Server actions require `'use server'` directive and serializable arguments (research:119-143)
- RLS policies are critical for security (research:350-397)

## What We're NOT Doing
- NOT creating a full application, only example patterns
- NOT auto-applying database migrations
- NOT requiring a live Supabase project to view examples
- NOT implementing BetterAuth (sticking with Supabase Auth)
- NOT adding production deployment configuration

## Implementation Approach
Four phases progressing from foundation to complete testing setup, ensuring each phase builds on the previous one.

## Phase 1: Foundation Setup

### Overview
Install dependencies, configure TypeScript paths, and create the basic directory structure.

### Changes Required:

#### 1. Install Dependencies
**File**: `web/package.json`
**Changes**: Add dependencies via npm

```bash
cd web
npm i @supabase/supabase-js @supabase/ssr zod
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths @playwright/test @vitest/ui
```

**Rationale**: Core dependencies for Supabase integration, validation, and testing.

#### 2. Configure TypeScript Paths
**File**: `web/tsconfig.json`
**Changes**: Add path mappings at lines 3-8

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/examples/*": ["examples/*"]
    },
    // ... existing config
  }
}
```

**Rationale**: Enables clean imports like `@/examples/supabase/client` throughout codebase.

#### 3. Update Package Scripts
**File**: `web/package.json`
**Changes**: Add test scripts to scripts section

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui"
  }
}
```

**Rationale**: Provides commands for type checking and running tests.

#### 4. Create Directory Structure
**Action**: Create directories

```bash
mkdir -p web/examples/{supabase,auth,api,schemas,components,middleware,db,tests,ci}
```

**Rationale**: Organized structure for different example categories.

#### 5. Environment Template
**File**: `web/.env.example`
**Changes**: Create new file

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here

# Optional: For testing with local Supabase
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-tests
```

**Rationale**: Template for developers to configure their environment.

### Success Criteria:

#### Automated Verification:
- [ ] Dependencies installed: `test -f web/package-lock.json`
- [ ] TypeScript paths configured: `grep -q "@/examples" web/tsconfig.json`
- [ ] Directory structure exists: `test -d web/examples/supabase`
- [ ] Environment template exists: `test -f web/.env.example`

#### Manual Verification:
- [ ] `npm run typecheck` executes without errors
- [ ] Import paths like `@/examples/*` resolve correctly

---

## Phase 2: Core Supabase Implementation

### Overview
Create Supabase client implementations and authentication patterns.

### Dependencies
- Phase 1 must be complete

### Changes Required:

#### 1. Browser Client
**File**: `web/examples/supabase/client.ts`
**Changes**: Create new file

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

**Rationale**: Client-side Supabase access for React components.

#### 2. Server Client
**File**: `web/examples/supabase/server.ts`
**Changes**: Create new file

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Swallow error if called from Server Component
          }
        },
      },
    }
  )
}
```

**Rationale**: Server-side client with proper cookie handling for SSR.

#### 3. Authentication Server Actions
**File**: `web/examples/auth/server-actions.ts`
**Changes**: Create new file

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/examples/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/welcome')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
```

**Rationale**: Server actions for authentication with proper form handling.

#### 4. Auth Middleware
**File**: `web/examples/middleware/auth.middleware.ts`
**Changes**: Create new file

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  await supabase.auth.getUser()
  return supabaseResponse
}
```

**Rationale**: Middleware for refreshing auth sessions.

#### 5. Auth Components
**File**: `web/examples/components/RequireAuth.tsx`
**Changes**: Create new file

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/examples/supabase/server'

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
```

**File**: `web/examples/components/ProtectedProfile.tsx`
**Changes**: Create new file

```typescript
import { redirect } from 'next/navigation'
import { createClient } from '@/examples/supabase/server'

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
```

**Rationale**: Reusable auth components demonstrating RLS data fetching.

### Success Criteria:

#### Automated Verification:
- [ ] Files exist: `test -f web/examples/supabase/client.ts`
- [ ] Files exist: `test -f web/examples/supabase/server.ts`
- [ ] Files exist: `test -f web/examples/auth/server-actions.ts`
- [ ] TypeScript compiles: `cd web && npm run typecheck`

#### Manual Verification:
- [ ] Import statements use `@/examples/*` pattern
- [ ] Server actions have `'use server'` directive
- [ ] Cookie handling includes try/catch for Server Components

---

## Phase 3: API Patterns and Database

### Overview
Add API route handlers with validation, schemas, and database examples.

### Dependencies
- Phase 2 must be complete

### Changes Required:

#### 1. Zod Schemas
**File**: `web/examples/schemas/user.schema.ts`
**Changes**: Create new file

```typescript
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2).max(50).optional(),
})

export type User = z.infer<typeof userSchema>

// Form validation schema with password confirmation
export const signUpSchema = userSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Update profile schema
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
})
```

**Rationale**: Reusable validation schemas with TypeScript inference.

#### 2. API Route Handler
**File**: `web/examples/api/route-handler-zod.ts`
**Changes**: Create new file

```typescript
// Example for app/api/items/route.ts implementation
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/examples/supabase/server'

const createItemSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Parse and validate body
  const body = await request.json()
  const result = createItemSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 }
    )
  }

  // Process validated data
  const validated = result.data

  // Example database operation
  const { data, error } = await supabase
    .from('items')
    .insert({
      ...validated,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Database error', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    data,
  })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  const { data, error } = await supabase
    .from('items')
    .select('*')
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}
```

**Rationale**: Complete API route example with auth, validation, and database operations.

#### 3. Database Migrations
**File**: `web/examples/db/001_profiles.sql`
**Changes**: Create new file

```sql
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create items table for examples
CREATE TABLE public.items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

**Rationale**: Example schema with common patterns like updated_at triggers.

#### 4. RLS Policies
**File**: `web/examples/db/002_policies.sql`
**Changes**: Create new file

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Items policies
CREATE POLICY "Users can view own items"
  ON public.items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create items"
  ON public.items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.items
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Example of public read policy
CREATE POLICY "Anyone can view public items"
  ON public.items
  FOR SELECT
  USING (priority = 'high');
```

**Rationale**: Comprehensive RLS examples covering common access patterns.

### Success Criteria:

#### Automated Verification:
- [ ] Schema files exist: `test -f web/examples/schemas/user.schema.ts`
- [ ] SQL files exist: `test -f web/examples/db/001_profiles.sql`
- [ ] TypeScript compiles: `cd web && npm run typecheck`
- [ ] Zod schemas use safeParse: `grep -q "safeParse" web/examples/api/route-handler-zod.ts`

#### Manual Verification:
- [ ] API handler demonstrates error handling
- [ ] RLS policies cover CRUD operations
- [ ] Schemas include type inference examples

---

## Phase 4: Testing and CI Setup

### Overview
Add test examples and CI/CD configuration.

### Dependencies
- Phase 3 must be complete

### Changes Required:

#### 1. Vitest Configuration
**File**: `web/vitest.config.ts`
**Changes**: Create new file

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './examples/tests/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/examples': path.resolve(__dirname, './examples'),
    },
  },
})
```

**Rationale**: Configure Vitest for React component testing.

#### 2. Test Setup
**File**: `web/examples/tests/setup.ts`
**Changes**: Create new file

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

**Rationale**: Common test setup and cleanup.

#### 3. Unit Test Example
**File**: `web/examples/tests/unit.sample.test.ts`
**Changes**: Create new file

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { signIn, signUp, signOut } from '@/examples/auth/server-actions'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('@/examples/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Authentication Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should sign in with valid credentials', async () => {
    const { createClient } = await import('@/examples/supabase/server')
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
    const { createClient } = await import('@/examples/supabase/server')
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
```

**Rationale**: Demonstrates mocking and testing server actions.

#### 4. Playwright Configuration
**File**: `web/playwright.config.ts`
**Changes**: Create new file

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './examples/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

**Rationale**: E2E test configuration with dev server setup.

#### 5. E2E Test Example
**File**: `web/examples/tests/auth.e2e.ts`
**Changes**: Create new file

```typescript
import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')

    // Check form elements exist
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    // Fill in invalid credentials
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')

    // Should redirect to error page
    await expect(page).toHaveURL('/error')
  })

  test('should protect authenticated routes', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/dashboard')

    // Should redirect to login
    await expect(page).toHaveURL('/login')
  })
})
```

**Rationale**: Basic E2E tests for authentication flow.

#### 6. GitHub Actions CI
**File**: `web/examples/ci/github-actions.yml`
**Changes**: Create new file

```yaml
name: CI

on:
  pull_request:
    paths:
      - 'web/**'
      - '.github/workflows/ci.yml'
  push:
    branches:
      - main
    paths:
      - 'web/**'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        run: |
          cd web
          npm ci

      - name: Type check
        run: |
          cd web
          npm run typecheck

      - name: Lint
        run: |
          cd web
          npm run lint

      - name: Unit tests
        run: |
          cd web
          npm test
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY }}

      - name: Install Playwright
        run: |
          cd web
          npx playwright install --with-deps chromium

      - name: E2E tests
        run: |
          cd web
          npm run e2e
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY }}

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: web/playwright-report/
          retention-days: 30
```

**Rationale**: Complete CI pipeline with caching and artifact upload.

#### 7. Examples README
**File**: `web/examples/README.md`
**Changes**: Create new file

```markdown
# Next.js + Supabase Examples

This directory contains example patterns for Context Engineering to reference when implementing features.

## Quick Start

1. Copy `.env.example` to `.env.local` and add your Supabase credentials
2. Install dependencies: `npm install`
3. Run type checking: `npm run typecheck`
4. Run tests: `npm test`

## Directory Structure

- `supabase/` - Supabase client configurations
- `auth/` - Authentication server actions
- `api/` - API route handler examples
- `schemas/` - Zod validation schemas
- `components/` - Auth-related React components
- `middleware/` - Next.js middleware examples
- `db/` - Database migrations and RLS policies
- `tests/` - Unit and E2E test examples
- `ci/` - CI/CD configurations

## Key Patterns

### Using Supabase Clients

- Use `@/examples/supabase/client` for Client Components
- Use `@/examples/supabase/server` for Server Components/Actions
- Always handle auth errors gracefully

### Validation

Always use `safeParse` instead of `parse`:

\`\`\`typescript
const result = schema.safeParse(data)
if (!result.success) {
  // Handle validation errors
  return { error: result.error.issues }
}
// Use result.data
\`\`\`

### Server Actions

- Always include `'use server'` directive
- Use FormData for form submissions
- Handle redirects for success/error cases

### Testing

- Unit tests mock Supabase client
- E2E tests run against dev server
- Always clean up after tests

## Running Tests

\`\`\`bash
npm test          # Run unit tests
npm run e2e       # Run E2E tests
npm run test:ui   # Open Vitest UI
npm run e2e:ui    # Open Playwright UI
\`\`\`
```

**Rationale**: Documentation for developers using the examples.

### Success Criteria:

#### Automated Verification:
- [ ] Tests pass: `cd web && npm test`
- [ ] E2E config exists: `test -f web/playwright.config.ts`
- [ ] CI config exists: `test -f web/examples/ci/github-actions.yml`
- [ ] README exists: `test -f web/examples/README.md`

#### Manual Verification:
- [ ] Unit tests demonstrate mocking patterns
- [ ] E2E tests cover authentication flow
- [ ] CI pipeline includes all necessary steps
- [ ] Documentation is clear and complete

---

## Testing Strategy

### Unit Tests:
- Test server actions with mocked Supabase client
- Verify validation schemas handle edge cases
- Mock Next.js navigation functions

### Integration Tests:
- Test API routes with request/response cycles
- Verify middleware session handling
- Test RLS policies with different user contexts

### Manual Testing Steps:
1. Create `.env.local` with Supabase credentials
2. Run `npm run dev` and navigate to example routes
3. Test authentication flow (sign up, sign in, sign out)
4. Verify protected routes redirect when unauthenticated
5. Check that RLS policies work as expected

## Performance Considerations
- Supabase clients are lightweight and connection pooling is handled
- Server actions minimize client-server roundtrips
- Validation happens early to prevent unnecessary database calls

## Migration Notes
To use these examples in a real project:
1. Copy relevant files to your app structure
2. Update imports from `@/examples/*` to your paths
3. Apply database migrations to your Supabase project
4. Configure environment variables

## Rollback Plan
1. Examples are isolated in `web/examples/` directory
2. Can be removed without affecting main application
3. Dependencies can be uninstalled if not needed

## Documentation Updates
- [ ] Update main README with examples reference
- [ ] Add inline comments explaining complex patterns
- [ ] Document any Supabase dashboard configuration needed

## References
- Original research: `thoughts/shared/research/2025-09-19_1939_examples_seed.md`
- Context Engineering guide: `README.md:238-265`
- Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side/nextjs
- Next.js App Router: https://nextjs.org/docs/app

## Validation Gates for PRPs

When generating PRPs using these examples:
1. Must pass `npm run typecheck && npm test && npm run e2e` in `web/`
2. Examples must be cited in PRP `EXAMPLES:` section by path
3. RLS policies required for any database table touched
4. Server actions must use `'use server'` and FormData
5. API routes must use `safeParse` for validation