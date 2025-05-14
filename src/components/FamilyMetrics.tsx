"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

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

interface TrendAnalysis {
  healthTrend: 'up' | 'down' | 'stable'
  healthChange: number
  sizeTrend: 'up' | 'down' | 'stable'
  sizeChange: number
}

export default function FamilyMetrics({ familyId, timeRange }: FamilyMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [trends, setTrends] = useState<TrendAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!familyId) {
          setMetrics([])
          setTrends(null)
          return
        }

        const url = `/api/observations?familyId=${encodeURIComponent(familyId)}`
        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch data")
        const data = await response.json()
        
        if (data && data.length > 0) {
          const family = data[0]
          const metricData = family.locations
            .filter((loc: Location) => new Date(loc.date) >= timeRange[0] && new Date(loc.date) <= timeRange[1])
            .map((loc: Location) => ({
              date: new Date(loc.date).toLocaleDateString(),
              healthRating: family.healthRating,
              size: family.size
            }))
            .sort((a: MetricData, b: MetricData) => new Date(a.date).getTime() - new Date(b.date).getTime())
          
          setMetrics(metricData)

          // Calculate trends
          if (metricData.length >= 2) {
            const firstHealth = metricData[0].healthRating
            const lastHealth = metricData[metricData.length - 1].healthRating
            const firstSize = metricData[0].size
            const lastSize = metricData[metricData.length - 1].size

            const healthChange = lastHealth - firstHealth
            const sizeChange = lastSize - firstSize

            setTrends({
              healthTrend: healthChange > 0 ? 'up' : healthChange < 0 ? 'down' : 'stable',
              healthChange: Math.abs(healthChange),
              sizeTrend: sizeChange > 0 ? 'up' : sizeChange < 0 ? 'down' : 'stable',
              sizeChange: Math.abs(sizeChange)
            })
          }
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
  if (metrics.length === 0) return <div className="flex items-center justify-center h-full">No data available for this time range</div>

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="size">Size</TabsTrigger>
          <TabsTrigger value="combined">Combined</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
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
        </TabsContent>

        <TabsContent value="size">
          <Card>
            <CardHeader>
              <CardTitle>Family Size Over Time</CardTitle>
              <CardDescription>Changes in family size from {timeRange[0].toLocaleDateString()} to {timeRange[1].toLocaleDateString()}</CardDescription>
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
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }: TooltipProps<number, string>) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm text-gray-600">
                                Size: {payload[0].value} members
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="size"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combined">
          <Card>
            <CardHeader>
              <CardTitle>Health & Size Over Time</CardTitle>
              <CardDescription>Combined view of health rating and family size from {timeRange[0].toLocaleDateString()} to {timeRange[1].toLocaleDateString()}</CardDescription>
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
                      yAxisId="health"
                      domain={[0, 10]}
                      tickCount={11}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Health Rating', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="size"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      label={{ value: 'Size', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }: TooltipProps<number, string>) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <p className="font-medium">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-sm text-gray-600">
                                  {entry.name === 'healthRating' ? 'Health Rating' : 'Size'}: {entry.value}
                                  {entry.name === 'healthRating' ? '/10' : ' members'}
                                </p>
                              ))}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="health"
                      type="monotone"
                      dataKey="healthRating"
                      name="Health Rating"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="size"
                      type="monotone"
                      dataKey="size"
                      name="Size"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Rating</span>
                <div className="text-2xl font-bold">{metrics[metrics.length - 1]?.healthRating}/10</div>
              </div>
              {trends && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <div className="flex items-center gap-2">
                    {renderTrendIcon(trends.healthTrend)}
                    <span className={trends.healthTrend === 'up' ? 'text-green-500' : trends.healthTrend === 'down' ? 'text-red-500' : 'text-gray-500'}>
                      {trends.healthChange} points
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Size Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Size</span>
                <div className="text-2xl font-bold">{metrics[metrics.length - 1]?.size} members</div>
              </div>
              {trends && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <div className="flex items-center gap-2">
                    {renderTrendIcon(trends.sizeTrend)}
                    <span className={trends.sizeTrend === 'up' ? 'text-green-500' : trends.sizeTrend === 'down' ? 'text-red-500' : 'text-gray-500'}>
                      {trends.sizeChange} members
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
