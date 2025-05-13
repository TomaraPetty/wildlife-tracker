"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { LatLngExpression } from "leaflet"
import { findNearbyFamilies, getFamilyLocations, getHerdFamilies } from "@/lib/maps"
import { mockFamilies } from "@/lib/maps"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { Icon } from "leaflet"
import "leaflet/dist/leaflet.css"

interface Family {
  id: string
  herdId: string
  locations: Array<{
    lat: number
    lng: number
    date: string
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
  const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  const [isLoading, setIsLoading] = useState(true)
  const [families, setFamilies] = useState<Family[]>([])
  const [familyLocations, setFamilyLocations] = useState<Array<{ lat: number; lng: number; date: string }>>([])

  useEffect(() => {
    const loadData = async () => {
      if (props.type === "location-families" && props.location) {
        const nearbyFamilies = await findNearbyFamilies([props.location.lat, props.location.lng], 10)
        setFamilies(nearbyFamilies)
      } else if (props.type === "family" && props.familyId) {
        const locations = getFamilyLocations(props.familyId)
        setFamilyLocations(locations)
      } else if (props.type === "herd" && props.herdId) {
        const herdFamilies = getHerdFamilies(props.herdId)
        setFamilies(herdFamilies)
      } else {
        // Show all families by default
        setFamilies(mockFamilies)
      }
      setIsLoading(false)
    }

    loadData()
  }, [props.type, props.herdId, props.familyId, props.location])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Default to LA area since that's where our mock data is centered
  const center: LatLngExpression = props.location ? [props.location.lat, props.location.lng] : [34.0522, -118.2437]

  return (
    <div className="w-full h-full" style={{ minHeight: "500px" }}>
      <MapContainer
        center={center}
        zoom={10}
        className="w-full h-full"
        style={{ minHeight: "500px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show selected location marker */}
        {props.location && (
          <Marker position={[props.location.lat, props.location.lng] as LatLngExpression} icon={icon}>
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
          return (
            <Marker
              key={family.id}
              position={[lastLocation.lat, lastLocation.lng] as LatLngExpression}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{family.id}</h3>
                  <p>Herd: {family.herdId}</p>
                  <p>Size: {family.size}</p>
                  <p>Health: {family.healthRating}/10</p>
                  <p>Last seen: {lastLocation.date}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Show family movement paths */}
        {families.map((family) => (
          <Polyline
            key={`path-${family.id}`}
            positions={family.locations.map(loc => [loc.lat, loc.lng] as LatLngExpression)}
            pathOptions={{ color: 'red', weight: 2 }}
          />
        ))}

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
