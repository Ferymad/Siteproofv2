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

```typescript
const result = schema.safeParse(data)
if (!result.success) {
  // Handle validation errors
  return { error: result.error.issues }
}
// Use result.data
```

### Server Actions

- Always include `'use server'` directive
- Use FormData for form submissions
- Handle redirects for success/error cases

### Testing

- Unit tests mock Supabase client
- E2E tests run against dev server
- Always clean up after tests

## Running Tests

```bash
npm test          # Run unit tests
npm run e2e       # Run E2E tests
npm run test:ui   # Open Vitest UI
npm run e2e:ui    # Open Playwright UI
```