"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"

interface Location {
  lat: number
  lng: number
  date: string
  events?: Array<{
    type: 'birth' | 'health' | 'migration'
    description: string
    severity?: 'low' | 'medium' | 'high'
    affectedCount?: number
  }>
}

interface Family {
  id: string
  herdId: string
  locations: Location[]
  size: number
  healthRating: number
}

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapViewProps {
  type: "herd" | "family" | "location-families"
  herdId?: string | null
  familyId?: string | null
  location?: { lat: number; lng: number } | null
  timeRange: [Date, Date]
}

export default function MapView({ type, herdId, familyId, location, timeRange }: MapViewProps) {
  const mapRef = useRef<L.Map>(null)
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const url = "/api/observations"

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch data")
        const data = await response.json()
        setFamilies(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type, herdId, familyId, location])

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>

  const center = location || { lat: 44.4279, lng: -110.5885 } // Yellowstone center
  const zoom = location ? 10 : 9

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      className="w-full h-full"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {families.map((family) => {
        const isWolf = family.herdId.toLowerCase().includes("wolf")
        const iconClass = isWolf ? "grayscale brightness-50" : "hue-rotate-30 saturate-200"
        const customIcon = new Icon({
          ...defaultIcon.options,
          className: iconClass,
        })

        // Get locations within time range
        const filteredLocations = timeRange 
          ? family.locations.filter(
              (loc) => new Date(loc.date) >= timeRange[0] && new Date(loc.date) <= timeRange[1]
            )
          : family.locations

        // Create polyline coordinates for migration path
        const polylineCoords = filteredLocations.map(loc => [loc.lat, loc.lng] as [number, number])

        return (
          <div key={family.id}>
            {filteredLocations.map((loc, index) => (
              <Marker
                key={`${family.id}-${index}`}
                position={[loc.lat, loc.lng]}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold">{family.id}</h3>
                    <p>Herd: {family.herdId}</p>
                    <p>Size: {family.size}</p>
                    <p>Health: {family.healthRating}/10</p>
                    <p>Last seen: {new Date(loc.date).toLocaleDateString()}</p>
                    <p>Type: {isWolf ? "Wolf Pack" : "Bison Herd"}</p>
                    {loc.events && loc.events.length > 0 && (
                      <div className="mt-2">
                        <h4 className="font-semibold">Recent Events:</h4>
                        {loc.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="mt-1">
                            <p className={`font-medium ${
                              event.type === 'health' && event.severity === 'high' ? 'text-red-500' :
                              event.type === 'health' && event.severity === 'medium' ? 'text-orange-500' :
                              event.type === 'birth' ? 'text-green-500' : ''
                            }`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </p>
                            <p className="text-sm text-gray-600">{event.description}</p>
                            {event.affectedCount && (
                              <p className="text-xs text-gray-500">Affected: {event.affectedCount}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            {polylineCoords.length > 1 && (
              <Polyline
                positions={polylineCoords}
                pathOptions={{
                  color: isWolf ? '#4B5563' : '#92400E',
                  weight: 3,
                  opacity: 0.7
                }}
              />
            )}
          </div>
        )
      })}
    </MapContainer>
  )
}
