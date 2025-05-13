"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Heart, TrendingUp } from "lucide-react"

type FamilyMetricsProps = {
  familyId: string | null
  timeRange: Date[]
}

export default function FamilyMetrics({ familyId, timeRange }: FamilyMetricsProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [familyId])

  // Generate mock data for visualization
  const generateTimeSeriesData = () => {
    const data = []
    const startDate = new Date(timeRange[0])
    const endDate = new Date(timeRange[1])
    const dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Generate data points for each month in the range
    for (let i = 0; i <= dayDiff; i += 30) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      data.push({
        date: date.toLocaleDateString(),
        size: Math.floor(Math.random() * 10) + 15, // Random size between 15-25
        health: Math.floor(Math.random() * 30) + 70, // Random health between 70-100
        births: Math.floor(Math.random() * 3),
        deaths: Math.floor(Math.random() * 2),
      })
    }

    return data
  }

  const metricsData = generateTimeSeriesData()

  if (!familyId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No Family Selected</h3>
          <p className="text-sm text-muted-foreground">Select a family to view its metrics</p>
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
    <div className="h-full">
      <Tabs defaultValue="size" className="h-full flex flex-col">
        <TabsList className="self-center">
          <TabsTrigger value="size">
            <Users className="mr-2 h-4 w-4" />
            Family Size
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="mr-2 h-4 w-4" />
            Health Rating
          </TabsTrigger>
          <TabsTrigger value="combined">
            <TrendingUp className="mr-2 h-4 w-4" />
            Combined View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="size" className="flex-1 mt-4">
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              {/* This would be replaced with an actual chart library like Chart.js or Recharts */}
              <div className="absolute inset-0 border-b border-l border-gray-300">
                <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-primary/10 rounded-md"></div>
                {metricsData.map((point, index) => {
                  const x = `${(index / (metricsData.length - 1)) * 100}%`
                  const height = `${(point.size / 30) * 60}%`

                  return (
                    <div
                      key={index}
                      className="absolute bottom-0 w-4 bg-primary rounded-t-md"
                      style={{
                        left: `calc(${x} - 8px)`,
                        height: height,
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                        {point.size}
                      </div>
                    </div>
                  )
                })}

                {/* X-axis labels */}
                <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-xs text-muted-foreground">
                  {metricsData.map((point, index) => (
                    <div key={index}>{point.date}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Average Size</div>
                  <div className="text-2xl font-bold">
                    {Math.round(metricsData.reduce((acc, point) => acc + point.size, 0) / metricsData.length)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Growth Rate</div>
                  <div className="text-2xl font-bold text-green-500">+12.5%</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="health" className="flex-1 mt-4">
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              {/* This would be replaced with an actual chart library */}
              <div className="absolute inset-0 border-b border-l border-gray-300">
                <div className="absolute bottom-0 left-0 right-0 h-[80%] bg-green-100 rounded-md"></div>
                {metricsData.map((point, index) => {
                  const x = `${(index / (metricsData.length - 1)) * 100}%`
                  const height = `${(point.health / 100) * 80}%`

                  return (
                    <div
                      key={index}
                      className="absolute bottom-0 w-4 bg-green-500 rounded-t-md"
                      style={{
                        left: `calc(${x} - 8px)`,
                        height: height,
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                        {point.health}%
                      </div>
                    </div>
                  )
                })}

                {/* X-axis labels */}
                <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-xs text-muted-foreground">
                  {metricsData.map((point, index) => (
                    <div key={index}>{point.date}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Average Health</div>
                  <div className="text-2xl font-bold">
                    {Math.round(metricsData.reduce((acc, point) => acc + point.health, 0) / metricsData.length)}%
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium">Health Trend</div>
                  <div className="text-2xl font-bold text-green-500">Stable</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="combined" className="flex-1 mt-4">
          <div className="h-full flex flex-col">
            <div className="flex-1 relative">
              {/* This would be replaced with an actual chart library */}
              <div className="absolute inset-0 border-b border-l border-gray-300">
                <div className="absolute bottom-0 left-0 right-0 h-[80%] bg-gray-50 rounded-md"></div>

                {/* Size line */}
                <svg className="absolute inset-0 h-full w-full overflow-visible">
                  <path
                    d={metricsData
                      .map((point, index) => {
                        const x = (index / (metricsData.length - 1)) * 100
                        const y = 100 - (point.size / 30) * 80
                        return `${index === 0 ? "M" : "L"} ${x} ${y}`
                      })
                      .join(" ")}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                  />
                </svg>

                {/* Health line */}
                <svg className="absolute inset-0 h-full w-full overflow-visible">
                  <path
                    d={metricsData
                      .map((point, index) => {
                        const x = (index / (metricsData.length - 1)) * 100
                        const y = 100 - (point.health / 100) * 80
                        return `${index === 0 ? "M" : "L"} ${x} ${y}`
                      })
                      .join(" ")}
                    fill="none"
                    stroke="green"
                    strokeWidth="2"
                  />
                </svg>

                {/* Data points */}
                {metricsData.map((point, index) => {
                  const x = `${(index / (metricsData.length - 1)) * 100}%`

                  return (
                    <div
                      key={index}
                      className="absolute bottom-[-24px] text-xs text-muted-foreground"
                      style={{
                        left: `calc(${x} - 20px)`,
                      }}
                    >
                      {point.date}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-sm">Family Size</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Health Rating</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
