import { NextResponse } from 'next/server'
import { mockFamilies } from '@/lib/maps'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const herdId = searchParams.get('herdId')
  const familyId = searchParams.get('familyId')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius')

  let data = mockFamilies

  // Filter by herd
  if (herdId) {
    data = data.filter(family => family.herdId === herdId)
  }

  // Filter by family
  if (familyId) {
    data = data.filter(family => family.id === familyId)
  }

  // Filter by location
  if (lat && lng && radius) {
    const centerLat = parseFloat(lat)
    const centerLng = parseFloat(lng)
    const radiusKm = parseFloat(radius)

    data = data.filter(family => {
      const lastLocation = family.locations[family.locations.length - 1]
      const distance = Math.sqrt(
        Math.pow(lastLocation.lat - centerLat, 2) + 
        Math.pow(lastLocation.lng - centerLng, 2)
      ) * 111 // Conversion to kilometers
      return distance <= radiusKm
    })
  }

  return NextResponse.json(data)
} 