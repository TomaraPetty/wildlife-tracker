interface Location {
  lat: number
  lng: number
  date: string
  events?: Array<{
    type: 'birth' | 'health' | 'split' | 'merge' | 'migration'
    description: string
    severity?: 'low' | 'medium' | 'high'
    affectedCount?: number
    newFamilyId?: string
    destinationHerdId?: string
  }>
}

interface Family {
  id: string
  herdId: string
  locations: Location[]
  size: number
  healthRating: number
}

export const mockFamilies: Family[] = [
  {
    id: "Family YSE-1",
    herdId: "Yellowstone East Bison",
    size: 45,
    healthRating: 9,
    locations: [
      {
        lat: 44.4279,
        lng: -110.5885,
        date: "2024-03-01",
        events: [
          {
            type: "birth",
            description: "3 new calves born",
            affectedCount: 3
          }
        ]
      },
      {
        lat: 44.4285,
        lng: -110.5890,
        date: "2024-03-05"
      },
      {
        lat: 44.4290,
        lng: -110.5895,
        date: "2024-03-10",
        events: [
          {
            type: "health",
            description: "Several individuals showing signs of respiratory infection",
            severity: "medium",
            affectedCount: 5
          }
        ]
      },
      {
        lat: 44.4295,
        lng: -110.5900,
        date: "2024-03-15"
      },
      {
        lat: 44.4300,
        lng: -110.5905,
        date: "2024-03-20"
      },
      {
        lat: 44.4305,
        lng: -110.5910,
        date: "2024-03-25",
        events: [
          {
            type: "split",
            description: "Herd split into two groups",
            newFamilyId: "Family YSE-1A"
          }
        ]
      }
    ]
  },
  {
    id: "Family YSE-1A",
    herdId: "Yellowstone East Bison",
    size: 20,
    healthRating: 8,
    locations: [
      {
        lat: 44.4305,
        lng: -110.5910,
        date: "2024-03-25",
        events: [
          {
            type: "split",
            description: "Split from Family YSE-1"
          }
        ]
      },
      {
        lat: 44.4310,
        lng: -110.5915,
        date: "2024-03-30"
      },
      {
        lat: 44.4315,
        lng: -110.5920,
        date: "2024-04-05"
      }
    ]
  },
  {
    id: "Family YSW-1",
    herdId: "Yellowstone West Bison",
    size: 35,
    healthRating: 7,
    locations: [
      {
        lat: 44.6000,
        lng: -110.8000,
        date: "2024-03-01"
      },
      {
        lat: 44.6010,
        lng: -110.8010,
        date: "2024-03-08",
        events: [
          {
            type: "health",
            description: "Multiple cases of brucellosis detected",
            severity: "high",
            affectedCount: 8
          }
        ]
      },
      {
        lat: 44.6020,
        lng: -110.8020,
        date: "2024-03-15"
      },
      {
        lat: 44.6030,
        lng: -110.8030,
        date: "2024-03-22",
        events: [
          {
            type: "migration",
            description: "Herd beginning seasonal migration to higher elevations",
            destinationHerdId: "Yellowstone Central Bison"
          }
        ]
      }
    ]
  },
  {
    id: "Pack YNP-1",
    herdId: "Yellowstone North Pack",
    size: 8,
    healthRating: 9,
    locations: [
      {
        lat: 44.9000,
        lng: -110.7000,
        date: "2024-03-01",
        events: [
          {
            type: "birth",
            description: "4 new pups born",
            affectedCount: 4
          }
        ]
      },
      {
        lat: 44.9010,
        lng: -110.7010,
        date: "2024-03-07"
      },
      {
        lat: 44.9020,
        lng: -110.7020,
        date: "2024-03-14",
        events: [
          {
            type: "merge",
            description: "Merged with Pack YNP-2",
            affectedCount: 6
          }
        ]
      },
      {
        lat: 44.9030,
        lng: -110.7030,
        date: "2024-03-21"
      }
    ]
  },
  {
    id: "Pack YNP-2",
    herdId: "Yellowstone North Pack",
    size: 6,
    healthRating: 8,
    locations: [
      {
        lat: 44.9020,
        lng: -110.7020,
        date: "2024-03-14",
        events: [
          {
            type: "merge",
            description: "Merged with Pack YNP-1"
          }
        ]
      }
    ]
  },
  {
    id: "Pack YSP-1",
    herdId: "Yellowstone South Pack",
    size: 7,
    healthRating: 9,
    locations: [
      {
        lat: 44.3000,
        lng: -110.5000,
        date: "2024-03-01"
      },
      {
        lat: 44.3010,
        lng: -110.5010,
        date: "2024-03-08",
        events: [
          {
            type: "health",
            description: "Alpha male showing signs of injury",
            severity: "medium",
            affectedCount: 1
          }
        ]
      },
      {
        lat: 44.3020,
        lng: -110.5020,
        date: "2024-03-15"
      },
      {
        lat: 44.3030,
        lng: -110.5030,
        date: "2024-03-22",
        events: [
          {
            type: "migration",
            description: "Pack following bison herd migration",
            destinationHerdId: "Yellowstone Central Pack"
          }
        ]
      }
    ]
  }
]

export const findNearbyFamilies = async (center: [number, number], radiusKm: number) => {
  return mockFamilies.filter(family => {
    const lastLocation = family.locations[family.locations.length - 1]
    const distance = Math.sqrt(
      Math.pow(lastLocation.lat - center[0], 2) + 
      Math.pow(lastLocation.lng - center[1], 2)
    ) * 111 // Conversion to kilometers
    return distance <= radiusKm
  })
}

export const getFamilyLocations = (familyId: string) => {
  const family = mockFamilies.find(f => f.id === familyId)
  return family?.locations || []
}

export const getHerdFamilies = (herdId: string) => {
  return mockFamilies.filter(family => family.herdId === herdId)
}