// Example for app/api/items/route.ts implementation
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '../supabase/server'

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