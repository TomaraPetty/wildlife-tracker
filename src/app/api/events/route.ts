import { NextResponse } from 'next/server'
interface Event {
  id: string
  type: string
  description: string
  location: string
  familyId: string
  date: string
  createdAt: string
  herdId?: string
}

const events: Event[] = []

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const familyId = searchParams.get('familyId')
    const herdId = searchParams.get('herdId')

    let filteredEvents = events

    if (familyId) {
      filteredEvents = filteredEvents.filter(e => e.familyId === familyId)
    }
    if (herdId) {
      filteredEvents = filteredEvents.filter(e => e.herdId === herdId)
    }

    return NextResponse.json(filteredEvents)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // TODO: Add validation
    const { type, description, location, familyId, date } = body

    const newEvent = {
      id: Date.now().toString(),
      type,
      description,
      location,
      familyId,
      date,
      createdAt: new Date().toISOString()
    }

    events.push(newEvent)

    return NextResponse.json({ 
      success: true, 
      message: 'Event recorded successfully',
      event: newEvent
    })
  } catch (error) {
    console.error('Error recording event:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to record event' },
      { status: 500 }
    )
  }
} 