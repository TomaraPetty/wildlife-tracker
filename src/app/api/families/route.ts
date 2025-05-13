import { NextResponse } from "next/server"
import { z } from "zod"

const familySchema = z.object({
  name: z.string().min(1),
  herdId: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = familySchema.parse(body)

    // TODO: Add database integration
    const family = {
      id: Math.random().toString(36).substr(2, 9),
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json(family, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 