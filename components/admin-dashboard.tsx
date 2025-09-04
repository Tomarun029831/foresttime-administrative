"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Trees,
  Users,
  MapPin,
  Clock,
  FileText,
  Wrench,
  LogOut,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { mockEmployees, mockPunches, mockTools, mockGeoFences } from "@/lib/mock-data"
import WorkAreaManagement from "./work-area-management"
import { AttendanceMonitoring } from "./attendance-monitoring"
import { EmployeeManagement } from "./employee-management"
import { ToolManagement } from "./tool-management"
import DailyReportScreen from "./daily-reports-enhanced"

interface AdminDashboardProps {
  onLogout: () => void
}

type ActiveView = "overview" | "geofence" | "attendance" | "employees" | "tools" | "reports"
type Screen = "dashboard" | "geofence" | "attendance" | "employees" | "tools" | "reports"

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>("overview")

  const handleNavigate = (screen: Screen) => {
    if (screen === "dashboard") {
      setActiveView("overview")
    } else {
      setActiveView(screen as ActiveView)
    }
  }

  const activeEmployees = mockEmployees.filter((emp) => emp.isActive).length
  const todayPunches = mockPunches.filter((punch) => {
    const today = new Date()
    const punchDate = new Date(punch.timestamp)
    return punchDate.toDateString() === today.toDateString()
  }).length
  const availableTools = mockTools.filter((tool) => tool.status === "available").length
  const activeGeoFences = mockGeoFences.filter((fence) => fence.isActive).length

  const navigationItems = [
    { id: "overview", label: "概要", icon: Activity },
    { id: "geofence", label: "作業エリア管理", icon: MapPin },
    { id: "attendance", label: "勤怠監視", icon: Clock },
    { id: "employees", label: "従業員管理", icon: Users },
    { id: "tools", label: "道具管理", icon: Wrench },
    { id: "reports", label: "日報", icon: FileText },
  ] as const

  const renderContent = () => {
    switch (activeView) {
      case "geofence":
        return <WorkAreaManagement onNavigate={handleNavigate} />

      case "attendance":
        return <AttendanceMonitoring />

      case "employees":
        return <EmployeeManagement />

      case "tools":
        return <ToolManagement />

      case "reports":
        return <DailyReportScreen onNavigate={handleNavigate} />

      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">システム概要</h2>
              <p className="text-muted-foreground">林業従事者の勤怠管理と作業監視システム</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">アクティブ従業員</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
                  <p className="text-xs text-muted-foreground">現在勤務中</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">本日の打刻</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{todayPunches}</div>
                  <p className="text-xs text-muted-foreground">打刻記録</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">利用可能道具</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{availableTools}</div>
                  <p className="text-xs text-muted-foreground">使用可能</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">作業エリア</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{activeGeoFences}</div>
                  <p className="text-xs text-muted-foreground">アクティブエリア</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    最近の打刻記録
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPunches.slice(0, 3).map((punch) => {
                      const employee = mockEmployees.find((emp) => emp.id === punch.employeeId)
                      return (
                        <div key={punch.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{employee?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {punch.type === "punch_in" ? "出勤" : "退勤"} - {punch.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant={punch.type === "punch_in" ? "default" : "secondary"}>
                            {punch.type === "punch_in" ? "IN" : "OUT"}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    システム状態
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">GPS追跡システム</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        正常
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">データベース接続</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        正常
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">モバイルアプリ連携</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        正常
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold mb-2">開発中</h3>
              <p className="text-muted-foreground">この機能は現在開発中です</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Trees className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">ForestTime</h1>
                <p className="text-xs text-muted-foreground">管理システム</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 space-y-2">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant={activeView === item.id ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          activeView === item.id ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-green-50"
                        }`}
                        onClick={() => setActiveView(item.id as ActiveView)}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Card>
              <CardContent className="p-6">{renderContent()}</CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
