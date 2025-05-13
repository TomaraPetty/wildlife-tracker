"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Users, Activity, MapPin } from "lucide-react"
import MapView from "@/components/MapView"
import TimelineControl from "@/components/TimelineControl"
import FamilyMetrics from "@/components/FamilyMetrics"
import EventsList from "@/components/EventsList"
import { toast } from "sonner"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("herd-tracking")
  const [selectedHerd, setSelectedHerd] = useState<string | null>(null)
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [timeRange, setTimeRange] = useState([new Date("2023-01-01"), new Date("2023-12-31")])

  // Mock data - TODO: come from an API
  const herds = ["Herd Alpha", "Herd Beta", "Herd Gamma"]
  const families = ["Family A-1", "Family A-2", "Family B-1", "Family G-1"]

  const handleLocationSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: geocode the location
    toast.success("Location selected", {
      description: "Map centered on the searched location",
    })
    setSelectedLocation({ lat: 34.0522, lng: -118.2437 })
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Herd Tracking Dashboard</h1>
          <p className="text-muted-foreground">Monitor herds, families, and events over time</p>
        </div>
        <div className="flex items-center gap-2">
          <form onSubmit={handleLocationSearch} className="flex gap-2">
            <Input placeholder="Search location..." className="w-[200px] md:w-[300px]" />
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Tabs defaultValue="herd-tracking" onValueChange={setActiveView} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="herd-tracking">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Herd Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="family-tracking">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Family Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="family-metrics">
            <Activity className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Family Metrics</span>
          </TabsTrigger>
          <TabsTrigger value="location-events">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Location Events</span>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(activeView === "herd-tracking" ||
                activeView === "family-tracking" ||
                activeView === "family-metrics") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Herd</label>
                  <Select onValueChange={(value) => setSelectedHerd(value)} value={selectedHerd || undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a herd" />
                    </SelectTrigger>
                    <SelectContent>
                      {herds.map((herd) => (
                        <SelectItem key={herd} value={herd}>
                          {herd}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(activeView === "family-tracking" || activeView === "family-metrics") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Family</label>
                  <Select
                    onValueChange={(value) => setSelectedFamily(value)}
                    value={selectedFamily || undefined}
                    disabled={!selectedHerd}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a family" />
                    </SelectTrigger>
                    <SelectContent>
                      {families.map((family) => (
                        <SelectItem key={family} value={family}>
                          {family}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Time Range</label>
                  <span className="text-xs text-muted-foreground">
                    {timeRange[0].toLocaleDateString()} - {timeRange[1].toLocaleDateString()}
                  </span>
                </div>
                <TimelineControl
                  value={[timeRange[0].getTime(), timeRange[1].getTime()]}
                  min={new Date("2020-01-01").getTime()}
                  max={new Date("2025-12-31").getTime()}
                  onChange={(values) => {
                    setTimeRange([new Date(values[0]), new Date(values[1])])
                  }}
                />
              </div>

              {activeView === "location-events" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Radius (km)</label>
                  <Slider defaultValue={[10]} max={100} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1km</span>
                    <span>50km</span>
                    <span>100km</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Event Types</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer">
                    Birth
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    Migration
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    Split
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    Merge
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer">
                    Health Issue
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-3 space-y-4">
            <TabsContent value="herd-tracking" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Herd Family Locations Over Time</CardTitle>
                  <CardDescription>
                    {selectedHerd
                      ? `Tracking families of ${selectedHerd}`
                      : "Select a herd to view its families' movements"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <MapView type="herd" herdId={selectedHerd} timeRange={timeRange as [Date, Date]} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family-tracking" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Family Movement Over Time</CardTitle>
                  <CardDescription>
                    {selectedFamily ? `Tracking ${selectedFamily}` : "Select a family to view its movement"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] p-0">
                  <MapView type="family" familyId={selectedFamily} timeRange={timeRange as [Date, Date]} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family-metrics" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Family Size & Health Metrics</CardTitle>
                  <CardDescription>
                    {selectedFamily ? `Metrics for ${selectedFamily}` : "Select a family to view its metrics"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[500px]">
                  <FamilyMetrics familyId={selectedFamily} timeRange={timeRange} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location-events" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Families Near Location</CardTitle>
                    <CardDescription>
                      {selectedLocation
                        ? "Families within the selected radius"
                        : "Select a location to view nearby families"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] p-0">
                    <MapView type="location-families" location={selectedLocation} timeRange={timeRange as [Date, Date]} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Events Near Location</CardTitle>
                    <CardDescription>
                      {selectedLocation
                        ? "Events within the selected radius"
                        : "Select a location to view nearby events"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventsList location={selectedLocation} timeRange={timeRange as [Date, Date]} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
