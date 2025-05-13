"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, MapPin, AlertCircle, Users, ArrowRight } from "lucide-react"

type EventsListProps = {
  location: { lat: number; lng: number } | null
  timeRange: Date[]
}

export default function EventsList({ location, timeRange }: EventsListProps) {
  const [isLoading, setIsLoading] = useState(true)
  console.log(timeRange)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [location])

  // Generate mock events for visualization
  const generateMockEvents = () => {
    if (!location) return []

    const eventTypes = [
      { type: "Birth", icon: <Users className="h-4 w-4" /> },
      { type: "Migration", icon: <ArrowRight className="h-4 w-4" /> },
      { type: "Split", icon: <ArrowRight className="h-4 w-4" /> },
      { type: "Merge", icon: <Users className="h-4 w-4" /> },
      { type: "Health Issue", icon: <AlertCircle className="h-4 w-4" /> },
    ]

    const herds = ["Herd Alpha", "Herd Beta", "Herd Gamma"]
    const families = ["Family A-1", "Family A-2", "Family B-1", "Family G-1"]

    return Array.from({ length: 10 }, (_, i) => {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const date = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)

      return {
        id: `event-${i}`,
        type: eventType.type,
        icon: eventType.icon,
        date: date,
        herd: herds[Math.floor(Math.random() * herds.length)],
        family: families[Math.floor(Math.random() * families.length)],
        distance: `${(Math.random() * 10).toFixed(1)}km`,
        description: `${eventType.type} event occurred near the selected location.`,
      }
    }).sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  const events = generateMockEvents()

  if (!location) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No Location Selected</h3>
          <p className="text-sm text-muted-foreground">Select a location to view nearby events</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[350px]">
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No events found in this area</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <Badge variant={event.type === "Health Issue" ? "destructive" : "default"}>
                    {event.icon}
                    <span className="ml-1">{event.type}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">{event.distance}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {event.date.toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm font-medium">{event.family}</div>
              <div className="text-xs text-muted-foreground">{event.herd}</div>
              <p className="text-xs mt-1">{event.description}</p>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}
