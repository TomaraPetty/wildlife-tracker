'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import MapView from "@/components/DynamicMap"

type EventType = 'birth' | 'health' | 'migration'

export default function RangerEventForm() {
  const [eventType, setEventType] = useState<EventType | ''>('')
  const [description, setDescription] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [familyId, setFamilyId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: eventType,
          description,
          location: selectedLocation,
          familyId,
          date: new Date().toISOString()
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit event')
      }

      toast.success("Event submitted successfully")
      // Reset form
      setEventType('')
      setDescription('')
      setSelectedLocation(null)
      setFamilyId('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit event")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit Wildlife Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select onValueChange={(value) => setEventType(value as EventType)} value={eventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birth">Birth</SelectItem>
                  <SelectItem value="health">Health Issue</SelectItem>
                  <SelectItem value="migration">Migration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Family ID</label>
              <Input
                placeholder="Enter family ID"
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <div className="h-[300px] rounded-md overflow-hidden">
                <MapView
                  type="location-select"
                  onLocationSelect={setSelectedLocation}
                  selectedLocation={selectedLocation}
                />
              </div>
              {selectedLocation && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting || !eventType || !description || !selectedLocation}>
              {isSubmitting ? "Submitting..." : "Submit Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 