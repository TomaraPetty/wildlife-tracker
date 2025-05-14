"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FamilyMetricsProps {
  familyId: string | null
  timeRange: [Date, Date]
}

interface MetricData {
  date: string
  healthRating: number
  size: number
}

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

export default function FamilyMetrics({ familyId, timeRange }: FamilyMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!familyId) {
          setMetrics([])
          return
        }

        const url = `/api/observations?familyId=${encodeURIComponent(familyId)}`
        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch data")
        const data = await response.json()
        
        // Transform location data into metrics
        const family = data[0] as Family
        if (family) {
          const metricData = family.locations
            .filter((loc: Location) => new Date(loc.date) >= timeRange[0] && new Date(loc.date) <= timeRange[1])
            .map((loc: Location) => ({
              date: new Date(loc.date).toLocaleDateString(),
              healthRating: family.healthRating,
              size: family.size
            }))
            .sort((a: MetricData, b: MetricData) => new Date(a.date).getTime() - new Date(b.date).getTime())
          
          setMetrics(metricData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [familyId, timeRange])

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-full text-red-500">{error}</div>
  if (!familyId) return <div className="flex items-center justify-center h-full">Select a family to view metrics</div>
  if (metrics.length === 0) return <div className="flex items-center justify-center h-full">No data available. Try a different time range.</div>

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Health Rating Over Time</CardTitle>
          <CardDescription>Changes in family health rating from {timeRange[0].toLocaleDateString()} to {timeRange[1].toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 10]}
                  tickCount={11}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload, label }: TooltipProps<number, string>) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-gray-600">
                            Health Rating: {payload[0].value}/10
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="healthRating"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Current Health Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics[metrics.length - 1]?.healthRating}/10</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics[metrics.length - 1]?.size} members</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
