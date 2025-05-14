"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { LatLngExpression } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons
import L from 'leaflet'
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface Family {
  id: string
  herdId: string
  locations: Array<{
    lat: number
    lng: number
    date: string
    events?: Array<{
      type: string
      severity?: string
      description: string
      affectedCount?: number
    }>
  }>
  size: number
  healthRating: number
}

interface MapViewProps {
  type: "herd" | "family" | "location-families"
  herdId?: string | null
  familyId?: string | null
  location?: { lat: number; lng: number } | null
  timeRange?: [Date, Date]
}

const MapViewComponent = (props: MapViewProps) => {
  const bisonIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'hue-rotate-30 saturate-200'
  })

  const wolfIcon = new Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'grayscale brightness-50'
  })

  const [isLoading, setIsLoading] = useState(true)
  const [families, setFamilies] = useState<Family[]>([])
  const [familyLocations, setFamilyLocations] = useState<Array<{ lat: number; lng: number; date: string }>>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const url = '/api/observations'
        const params = new URLSearchParams()

        if (props.type === "location-families" && props.location) {
          params.append('lat', props.location.lat.toString())
          params.append('lng', props.location.lng.toString())
          params.append('radius', '10')
        } else if (props.type === "family" && props.familyId) {
          params.append('familyId', props.familyId)
        } else if (props.type === "herd" && props.herdId) {
          params.append('herdId', props.herdId)
        }

        const response = await fetch(`${url}?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch wildlife data')
        }

        const data = await response.json()
        
        if (props.type === "family" && props.familyId) {
          setFamilyLocations(data[0]?.locations || [])
        } else {
          setFamilies(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching wildlife data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [props.type, props.herdId, props.familyId, props.location])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  // Center on Yellowstone
  const center: LatLngExpression = props.location ? [props.location.lat, props.location.lng] : [44.4279, -110.5885]

  const isWolfPack = (herdId: string) => herdId.toLowerCase().includes('pack')

  return (
    <div className="w-full h-full" style={{ minHeight: "500px" }}>
      <MapContainer
        center={center}
        zoom={9}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show selected location marker */}
        {props.location && (
          <Marker position={[props.location.lat, props.location.lng] as LatLngExpression} icon={bisonIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">Selected Location</h3>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Show family markers */}
        {families.map((family) => {
          const lastLocation = family.locations[family.locations.length - 1]
          const isWolf = isWolfPack(family.herdId)
          return (
            <Marker
              key={family.id}
              position={[lastLocation.lat, lastLocation.lng] as LatLngExpression}
              icon={isWolf ? wolfIcon : bisonIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{family.id}</h3>
                  <p>Group: {family.herdId}</p>
                  <p>Size: {family.size}</p>
                  <p>Health: {family.healthRating}/10</p>
                  <p>Last seen: {lastLocation.date}</p>
                  <p>Type: {isWolf ? 'Wolf Pack' : 'Bison Herd'}</p>
                  {lastLocation.events && lastLocation.events.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold">Recent Events:</h4>
                      {lastLocation.events.map((event, index) => (
                        <div key={index} className="mt-1 text-sm">
                          <p className={`font-medium ${
                            event.type === 'health' && event.severity === 'high' ? 'text-red-600' :
                            event.type === 'health' && event.severity === 'medium' ? 'text-orange-600' :
                            event.type === 'birth' ? 'text-green-600' :
                            'text-gray-600'
                          }`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}: {event.description}
                          </p>
                          {event.affectedCount && (
                            <p className="text-gray-500">Affected: {event.affectedCount}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Show family movement paths */}
        {families.map((family) => {
          const isWolf = isWolfPack(family.herdId)
          return (
            <Polyline
              key={`path-${family.id}`}
              positions={family.locations.map(loc => [loc.lat, loc.lng] as LatLngExpression)}
              pathOptions={{ 
                color: isWolf ? '#2d3748' : '#744210',
                weight: 2,
                opacity: 0.7
              }}
            />
          )
        })}

        {/* Show individual family movement path */}
        {familyLocations.length > 0 && (
          <Polyline
            positions={familyLocations.map(loc => [loc.lat, loc.lng] as LatLngExpression)}
            pathOptions={{ color: 'blue', weight: 3 }}
          />
        )}
      </MapContainer>
    </div>
  )
}

const MapView = dynamic(() => Promise.resolve(MapViewComponent), { ssr: false })
export default MapView
