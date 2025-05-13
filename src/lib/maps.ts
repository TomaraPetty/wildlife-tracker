// Mock data for visualization
export const mockFamilies = [
  {
    id: "Family A-1",
    herdId: "Herd Alpha",
    locations: [
      { lat: 34.0522, lng: -118.2437, date: "2024-01-01" },
      { lat: 34.0622, lng: -118.2537, date: "2024-01-15" },
      { lat: 34.0722, lng: -118.2637, date: "2024-02-01" },
    ],
    size: 15,
    healthRating: 8,
  },
  {
    id: "Family A-2",
    herdId: "Herd Alpha",
    locations: [
      { lat: 34.0422, lng: -118.2337, date: "2024-01-01" },
      { lat: 34.0522, lng: -118.2437, date: "2024-01-15" },
      { lat: 34.0622, lng: -118.2537, date: "2024-02-01" },
    ],
    size: 12,
    healthRating: 9,
  },
  {
    id: "Family B-1",
    herdId: "Herd Beta",
    locations: [
      { lat: 34.0822, lng: -118.2737, date: "2024-01-01" },
      { lat: 34.0922, lng: -118.2837, date: "2024-01-15" },
      { lat: 34.1022, lng: -118.2937, date: "2024-02-01" },
    ],
    size: 18,
    healthRating: 7,
  },
  {
    id: "Family C-1",
    herdId: "Herd Charlie",
    locations: [
      { lat: 34.1222, lng: -118.3137, date: "2024-01-01" },
      { lat: 34.1322, lng: -118.3237, date: "2024-01-15" },
      { lat: 34.1422, lng: -118.3337, date: "2024-02-01" },
    ],
    size: 20,
    healthRating: 9,
  },
  {
    id: "Family D-1",
    herdId: "Herd Delta",
    locations: [
      { lat: 34.1622, lng: -118.3537, date: "2024-01-01" },
      { lat: 34.1722, lng: -118.3637, date: "2024-01-15" },
      { lat: 34.1822, lng: -118.3737, date: "2024-02-01" },
    ],
    size: 16,
    healthRating: 8,
  }
]

export async function findNearbyFamilies(location: [number, number], radius: number) {
  // Mock implementation - returns families within radius
  return mockFamilies.filter(family => {
    const lastLocation = family.locations[family.locations.length - 1]
    const distance = Math.sqrt(
      Math.pow(lastLocation.lat - location[0], 2) + 
      Math.pow(lastLocation.lng - location[1], 2)
    ) * 111 // Rough conversion to kilometers
    return distance <= radius
  })
}

export function getFamilyLocations(familyId: string) {
  return mockFamilies.find(f => f.id === familyId)?.locations || []
}

export function getHerdFamilies(herdId: string) {
  return mockFamilies.filter(f => f.herdId === herdId)
} 