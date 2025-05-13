import { NextResponse } from "next/server"
import { z } from "zod"

const eventSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  description: z.string().min(1),
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const validatedData = eventSchema.parse(body)

    // TODO: Add database integration
    const event = {
      id: Math.random().toString(36).substr(2, 9),
      familyId: params.id,
      ...validatedData,
      createdAt: new Date(),
    }

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 