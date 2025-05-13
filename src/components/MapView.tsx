"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

type MapViewProps = {
  type: "herd" | "family" | "location-families" | "location-events"
  herdId?: string | null
  familyId?: string | null
  location?: { lat: number; lng: number } | null
  timeRange: Date[]
}

export default function MapView({ type, herdId, familyId, location, timeRange }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for visualization
  const mockHerdFamilies = [
    { id: "Family A-1", color: "#FF5733", path: generateRandomPath(), events: generateRandomEvents() },
    { id: "Family A-2", color: "#33FF57", path: generateRandomPath(), events: generateRandomEvents() },
    { id: "Family A-3", color: "#3357FF", path: generateRandomPath(), events: generateRandomEvents() },
  ]

//   const mockFamilyPath = generateRandomPath()
  const mockNearbyFamilies = [
    { id: "Family A-1", herd: "Herd Alpha", distance: "2.3km", lastSeen: "2 days ago" },
    { id: "Family B-2", herd: "Herd Beta", distance: "4.1km", lastSeen: "5 days ago" },
    { id: "Family G-1", herd: "Herd Gamma", distance: "8.7km", lastSeen: "Today" },
  ]

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [type, herdId, familyId, location])

  function generateRandomPath() {
    // Generate a random path for visualization
    const points = []
    let lat = 34.0522
    let lng = -118.2437

    for (let i = 0; i < 10; i++) {
      lat += (Math.random() - 0.5) * 0.05
      lng += (Math.random() - 0.5) * 0.05
      points.push({ lat, lng, date: new Date(2023, 0, i * 30) })
    }

    return points
  }

  function generateRandomEvents() {
    // Generate random events for visualization
    const eventTypes = ["Birth", "Migration", "Split", "Merge", "Health Issue"]
    const events = []

    for (let i = 0; i < 3; i++) {
      const randomPath = generateRandomPath()
      events.push({
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        location: randomPath[0],
        date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      })
    }

    return events
  }

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-md overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* This would be replaced with an actual map library like Leaflet or Google Maps */}
          <div ref={mapRef} className="w-full h-full bg-[#E8F4F8] relative">
            {/* Mock map content */}
            <div className="absolute inset-0 p-4">
              <div className="border-2 border-gray-300 border-dashed w-full h-full rounded-md flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Map overlay with information based on the view type */}
            <div className="absolute top-4 right-4 z-10">
              <Card className="p-3 bg-white/90 shadow-md max-w-xs">
                {type === "herd" && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Herd Families</h3>
                    <div className="space-y-1">
                      {mockHerdFamilies.map((family) => (
                        <div key={family.id} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: family.color }}></div>
                          <span className="text-sm">{family.id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {type === "family" && (
                  <div className="space-y-2">
                    <h3 className="font-medium">{familyId || "Family"} Path</h3>
                    <div className="text-xs space-y-1">
                      <div>Start: {timeRange[0].toLocaleDateString()}</div>
                      <div>End: {timeRange[1].toLocaleDateString()}</div>
                      <div>Total distance: 127.3 km</div>
                    </div>
                  </div>
                )}

                {type === "location-families" && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Nearby Families</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {mockNearbyFamilies.map((family) => (
                        <div key={family.id} className="text-xs border-b pb-1 last:border-0">
                          <div className="font-medium">{family.id}</div>
                          <div className="text-muted-foreground">{family.herd}</div>
                          <div className="flex justify-between">
                            <span>{family.distance}</span>
                            <span>{family.lastSeen}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Timeline indicator */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <Card className="p-2 bg-white/90 shadow-md">
                <div className="text-xs text-center">
                  Showing data from {timeRange[0].toLocaleDateString()} to {timeRange[1].toLocaleDateString()}
                </div>
              </Card>
            </div>

            {/* Event markers (simplified visualization) */}
            {type === "herd" &&
              mockHerdFamilies.flatMap((family) =>
                family.events.map((event, idx) => (
                  <div
                    key={`${family.id}-event-${idx}`}
                    className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{
                      top: `${30 + Math.random() * 60}%`,
                      left: `${30 + Math.random() * 60}%`,
                    }}
                  >
                    <Badge className="absolute -top-6 whitespace-nowrap">{event.type}</Badge>
                    <div className="w-6 h-6 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                )),
              )}
          </div>
        </>
      )}
    </div>
  )
}
