"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  FileText,
  Plus,
  Calendar,
  MapPin,
  Users,
  Activity,
  Navigation,
  TrendingUp,
  Clock,
  Mountain,
  Route,
  User,
  UserCheck,
} from "lucide-react"

type Screen = "dashboard" | "geofence" | "attendance" | "employees" | "tools" | "reports"

interface DailyReportScreenProps {
  onNavigate: (screen: Screen) => void
}

interface MovementData {
  timestamp: string
  latitude: number
  longitude: number
  altitude: number
  speed: number
  direction: number // Compass direction in degrees
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  distanceFromStart: number
}

interface ActivitySummary {
  totalDistance: number
  maxAltitude: number
  minAltitude: number
  totalElevationGain: number
  averageSpeed: number
  totalDuration: string
  restStops: number
  workAreas: string[]
}

interface AdminReport {
  id: string
  date: string
  adminName: string
  title: string
  summary: string
  type: "admin"
}

interface EmployeeReport {
  id: string
  date: string
  employee: string
  destination: string
  toolsUsed: string[]
  details: string
  movementTrack: MovementData[]
  activitySummary: ActivitySummary
  activityData: Array<{
    timestamp: string
    activity: string
    location?: {
      lat: number
      lng: number
      altitude: number
    }
  }>
  type: "employee"
}

type WorkReport = AdminReport | EmployeeReport

export default function DailyReportScreen({ onNavigate }: DailyReportScreenProps) {
  const [showForm, setShowForm] = useState(false)
  const [reportType, setReportType] = useState<"admin" | "employee">("admin")
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [newAdminReport, setNewAdminReport] = useState({
    title: "",
    summary: "",
  })
  const [newEmployeeReport, setNewEmployeeReport] = useState({
    employee: "",
    destination: "",
    toolsUsed: [] as string[],
    details: "",
  })

  const [reports] = useState<WorkReport[]>([
    {
      id: "admin-1",
      date: "2024-01-15",
      adminName: "管理者 太郎",
      title: "月次安全点検実施",
      summary: "全作業エリアの安全点検を実施。チェーンソーの整備状況確認、安全装備の在庫確認を行った。特に問題なし。",
      type: "admin",
    },
    {
      id: "1",
      date: "2024-01-15",
      employee: "田中太郎",
      destination: "山林A区域",
      toolsUsed: ["チェーンソー", "ヘルメット"],
      details:
        "杉林の間伐作業を実施。計30本の杉を伐採し、適切に処理した。安全に作業を完了。山の斜面での作業のため、慎重に移動しながら作業を進めた。",
      type: "employee",
      movementTrack: [
        {
          timestamp: "08:30:00",
          latitude: 35.6762,
          longitude: 139.6503,
          altitude: 350,
          speed: 1.2,
          direction: 45,
          accelerationX: 0.1,
          accelerationY: 0.05,
          accelerationZ: 9.8,
          distanceFromStart: 0,
        },
        {
          timestamp: "08:45:00",
          latitude: 35.677,
          longitude: 139.651,
          altitude: 380,
          speed: 0.8,
          direction: 60,
          accelerationX: 0.2,
          accelerationY: 0.1,
          accelerationZ: 9.9,
          distanceFromStart: 120,
        },
        {
          timestamp: "09:00:00",
          latitude: 35.6778,
          longitude: 139.6518,
          altitude: 420,
          speed: 0.5,
          direction: 75,
          accelerationX: 0.05,
          accelerationY: 0.02,
          accelerationZ: 9.8,
          distanceFromStart: 250,
        },
        {
          timestamp: "10:15:00",
          latitude: 35.6785,
          longitude: 139.6525,
          altitude: 450,
          speed: 0.0,
          direction: 75,
          accelerationX: 0.0,
          accelerationY: 0.0,
          accelerationZ: 9.8,
          distanceFromStart: 350,
        },
        {
          timestamp: "12:00:00",
          latitude: 35.679,
          longitude: 139.653,
          altitude: 470,
          speed: 0.0,
          direction: 90,
          accelerationX: 0.0,
          accelerationY: 0.0,
          accelerationZ: 9.8,
          distanceFromStart: 420,
        },
        {
          timestamp: "17:00:00",
          latitude: 35.6762,
          longitude: 139.6503,
          altitude: 350,
          speed: 1.5,
          direction: 225,
          accelerationX: -0.1,
          accelerationY: -0.05,
          accelerationZ: 9.7,
          distanceFromStart: 840,
        },
      ],
      activitySummary: {
        totalDistance: 2.4,
        maxAltitude: 470,
        minAltitude: 350,
        totalElevationGain: 120,
        averageSpeed: 0.8,
        totalDuration: "8時間30分",
        restStops: 3,
        workAreas: ["山林A区域北斜面", "山林A区域中腹"],
      },
      activityData: [
        { timestamp: "08:30", activity: "作業開始", location: { lat: 35.6762, lng: 139.6503, altitude: 350 } },
        { timestamp: "09:00", activity: "斜面移動開始", location: { lat: 35.677, lng: 139.651, altitude: 380 } },
        { timestamp: "10:15", activity: "休憩", location: { lat: 35.6785, lng: 139.6525, altitude: 450 } },
        { timestamp: "10:30", activity: "作業再開" },
        { timestamp: "12:00", activity: "昼休憩", location: { lat: 35.679, lng: 139.653, altitude: 470 } },
        { timestamp: "13:00", activity: "午後作業開始" },
        {
          timestamp: "17:00",
          activity: "作業終了・下山開始",
          location: { lat: 35.6762, lng: 139.6503, altitude: 350 },
        },
      ],
    },
    {
      id: "2",
      date: "2024-01-15",
      employee: "佐藤花子",
      destination: "山林B区域",
      toolsUsed: ["スコップ", "剪定ばさみ"],
      details: "ヒノキの植林準備作業。土壌の整備と苗木の植え付けを行った。比較的平坦な地形で作業効率が良好。",
      type: "employee",
      movementTrack: [
        {
          timestamp: "08:45:00",
          latitude: 35.6962,
          longitude: 139.6403,
          altitude: 280,
          speed: 0.9,
          direction: 90,
          accelerationX: 0.05,
          accelerationY: 0.1,
          accelerationZ: 9.8,
          distanceFromStart: 0,
        },
        {
          timestamp: "12:00:00",
          latitude: 35.697,
          longitude: 139.641,
          altitude: 285,
          speed: 0.0,
          direction: 90,
          accelerationX: 0.0,
          accelerationY: 0.0,
          accelerationZ: 9.8,
          distanceFromStart: 120,
        },
        {
          timestamp: "16:30:00",
          latitude: 35.6962,
          longitude: 139.6403,
          altitude: 280,
          speed: 0.8,
          direction: 270,
          accelerationX: -0.05,
          accelerationY: 0.0,
          accelerationZ: 9.8,
          distanceFromStart: 240,
        },
      ],
      activitySummary: {
        totalDistance: 1.2,
        maxAltitude: 285,
        minAltitude: 280,
        totalElevationGain: 5,
        averageSpeed: 0.6,
        totalDuration: "7時間45分",
        restStops: 2,
        workAreas: ["山林B区域平地部"],
      },
      activityData: [
        { timestamp: "08:45", activity: "作業開始", location: { lat: 35.6962, lng: 139.6403, altitude: 280 } },
        { timestamp: "12:00", activity: "昼休憩", location: { lat: 35.697, lng: 139.641, altitude: 285 } },
        { timestamp: "13:00", activity: "午後作業開始" },
        { timestamp: "16:30", activity: "作業終了", location: { lat: 35.6962, lng: 139.6403, altitude: 280 } },
      ],
    },
  ])

  const employees = ["田中太郎", "佐藤花子", "鈴木一郎", "高橋恵子", "山田次郎"]
  const workAreas = ["山林A区域", "山林B区域", "山林C区域"]
  const availableTools = ["チェーンソー", "ハンマー", "スコップ", "剪定ばさみ", "ヘルメット", "安全ベスト"]

  const toggleTool = (tool: string) => {
    setNewEmployeeReport((prev) => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(tool) ? prev.toolsUsed.filter((t) => t !== tool) : [...prev.toolsUsed, tool],
    }))
  }

  const handleSubmitAdminReport = () => {
    if (!newAdminReport.title || !newAdminReport.summary) {
      alert("すべての必須項目を入力してください")
      return
    }

    alert("管理者日報が正常に提出されました")
    setNewAdminReport({
      title: "",
      summary: "",
    })
    setShowForm(false)
  }

  const handleSubmitEmployeeReport = () => {
    if (!newEmployeeReport.employee || !newEmployeeReport.destination || !newEmployeeReport.details) {
      alert("すべての必須項目を入力してください")
      return
    }

    alert("従業員日報が正常に提出されました")
    setNewEmployeeReport({
      employee: "",
      destination: "",
      toolsUsed: [],
      details: "",
    })
    setShowForm(false)
  }

  const formatDistance = (distance: number) => {
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
  }

  const formatAltitude = (altitude: number) => {
    return `${altitude}m`
  }

  const formatSpeed = (speed: number) => {
    return `${speed.toFixed(1)}km/h`
  }

  const getDirectionText = (degrees: number) => {
    const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"]
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  const renderMovementVisualization = (report: EmployeeReport) => {
    if (!report.movementTrack || report.movementTrack.length === 0) return null

    const track = report.movementTrack
    const minLat = Math.min(...track.map((p) => p.latitude))
    const maxLat = Math.max(...track.map((p) => p.latitude))
    const minLng = Math.min(...track.map((p) => p.longitude))
    const maxLng = Math.max(...track.map((p) => p.longitude))

    const latRange = maxLat - minLat
    const lngRange = maxLng - minLng

    // Normalize coordinates to fit in a 400x300 SVG
    const normalizePoint = (lat: number, lng: number) => {
      const x = ((lng - minLng) / lngRange) * 380 + 10
      const y = ((maxLat - lat) / latRange) * 280 + 10
      return { x, y }
    }

    const pathData = track
      .map((point, index) => {
        const { x, y } = normalizePoint(point.latitude, point.longitude)
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
      })
      .join(" ")

    return (
      <div className="bg-green-50 rounded-lg p-4">
        <h5 className="font-medium mb-3 flex items-center space-x-2">
          <Route className="w-4 h-4" />
          <span>移動軌跡</span>
        </h5>
        <svg width="100%" height="300" viewBox="0 0 400 300" className="border rounded bg-white">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Path */}
          <path d={pathData} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {/* Points */}
          {track.map((point, index) => {
            const { x, y } = normalizePoint(point.latitude, point.longitude)
            const isStart = index === 0
            const isEnd = index === track.length - 1

            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={isStart || isEnd ? 6 : 4}
                  fill={isStart ? "#ef4444" : isEnd ? "#3b82f6" : "#10b981"}
                  stroke="white"
                  strokeWidth="2"
                />
                {(isStart || isEnd) && (
                  <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#374151" fontWeight="bold">
                    {isStart ? "スタート" : "終了"}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            スタート地点
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            終了地点
          </div>
        </div>
      </div>
    )
  }

  const renderAltitudeChart = (report: EmployeeReport) => {
    if (!report.movementTrack || report.movementTrack.length === 0) return null

    const track = report.movementTrack
    const minAlt = Math.min(...track.map((p) => p.altitude))
    const maxAlt = Math.max(...track.map((p) => p.altitude))
    const altRange = maxAlt - minAlt

    const points = track.map((point, index) => {
      const x = (index / (track.length - 1)) * 380 + 10
      const y = 250 - ((point.altitude - minAlt) / altRange) * 200
      return { x, y, altitude: point.altitude, time: point.timestamp }
    })

    const pathData = points
      .map((point, index) => (index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`))
      .join(" ")

    return (
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-medium mb-3 flex items-center space-x-2">
          <Mountain className="w-4 h-4" />
          <span>標高プロファイル</span>
        </h5>
        <svg width="100%" height="280" viewBox="0 0 400 280" className="border rounded bg-white">
          {/* Grid lines */}
          <defs>
            <pattern id="altGrid" width="40" height="28" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 28" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#altGrid)" />

          {/* Area under curve */}
          <path d={`${pathData} L ${points[points.length - 1].x} 250 L 10 250 Z`} fill="#3b82f6" fillOpacity="0.2" />

          {/* Altitude line */}
          <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

          {/* Points */}
          {points.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
          ))}

          {/* Y-axis labels */}
          <text x="5" y="25" fontSize="10" fill="#6b7280">
            {maxAlt}m
          </text>
          <text x="5" y="255" fontSize="10" fill="#6b7280">
            {minAlt}m
          </text>
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-orange-600 rounded-lg p-2">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">日報管理</h1>
                  <p className="text-sm text-muted-foreground">管理者日報と従業員日報の管理</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={reportType} onValueChange={(value: "admin" | "employee") => setReportType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">管理者日報</SelectItem>
                  <SelectItem value="employee">従業員日報</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowForm(!showForm)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                新しい{reportType === "admin" ? "管理者" : "従業員"}日報を作成
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* New Report Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {reportType === "admin" ? <User className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                <span>新しい{reportType === "admin" ? "管理者" : "従業員"}日報を作成</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {reportType === "admin"
                  ? "管理者による業務報告・点検記録などを記入してください"
                  : "iOSアプリから自動的に移動データが取得され、作業軌跡が記録されます"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportType === "admin" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">報告タイトル</Label>
                    <Input
                      id="title"
                      placeholder="例：月次安全点検、設備メンテナンス、会議報告など"
                      value={newAdminReport.title}
                      onChange={(e) => setNewAdminReport({ ...newAdminReport, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">報告内容</Label>
                    <Textarea
                      id="summary"
                      placeholder="実施した業務内容、点検結果、決定事項、特記事項などを詳しく記入してください"
                      value={newAdminReport.summary}
                      onChange={(e) => setNewAdminReport({ ...newAdminReport, summary: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitAdminReport} className="bg-orange-600 hover:bg-orange-700">
                      管理者日報を提出
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      キャンセル
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">従業員</Label>
                      <Select
                        value={newEmployeeReport.employee}
                        onValueChange={(value) => setNewEmployeeReport({ ...newEmployeeReport, employee: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="従業員を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee} value={employee}>
                              {employee}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">作業場所</Label>
                      <Select
                        value={newEmployeeReport.destination}
                        onValueChange={(value) => setNewEmployeeReport({ ...newEmployeeReport, destination: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="作業場所を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {workAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>使用道具</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTools.map((tool) => (
                        <Button
                          key={tool}
                          variant={newEmployeeReport.toolsUsed.includes(tool) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTool(tool)}
                          className="justify-start"
                        >
                          {tool}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">作業詳細</Label>
                    <Textarea
                      id="details"
                      placeholder="本日の作業内容、成果、特記事項などを詳しく記入してください"
                      value={newEmployeeReport.details}
                      onChange={(e) => setNewEmployeeReport({ ...newEmployeeReport, details: e.target.value })}
                      rows={5}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitEmployeeReport} className="bg-orange-600 hover:bg-orange-700">
                      従業員日報を提出
                    </Button>
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      キャンセル
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reports List */}
        <div className="space-y-6">
          <h2 className="text-2xl">日報一覧</h2>

          <div className="grid grid-cols-1 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <span>
                          {report.date}の{report.type === "admin" ? "管理者" : "従業員"}報告
                        </span>
                        <Badge variant={report.type === "admin" ? "default" : "secondary"}>
                          {report.type === "admin" ? "管理者" : "従業員"}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {report.type === "admin"
                              ? (report as AdminReport).adminName
                              : (report as EmployeeReport).employee}
                          </span>
                        </div>
                        {report.type === "employee" && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{(report as EmployeeReport).destination}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-orange-600">承認待ち</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {report.type === "admin" ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">報告タイトル</h4>
                        <p className="text-lg font-semibold">{(report as AdminReport).title}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">報告内容</h4>
                        <p className="text-muted-foreground">{(report as AdminReport).summary}</p>
                      </div>
                    </div>
                  ) : (
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="summary">概要</TabsTrigger>
                        <TabsTrigger value="activity">活動記録</TabsTrigger>
                        <TabsTrigger value="movement">移動軌跡</TabsTrigger>
                        <TabsTrigger value="sensors">センサー</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-medium mb-2">使用道具</h4>
                          <div className="flex flex-wrap gap-2">
                            {(report as EmployeeReport).toolsUsed.map((tool) => (
                              <Badge key={tool} variant="outline">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">作業詳細</h4>
                          <p className="text-muted-foreground">{(report as EmployeeReport).details}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3 flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>活動サマリー</span>
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">総移動距離</div>
                              <div className="font-semibold text-lg">
                                {formatDistance((report as EmployeeReport).activitySummary.totalDistance)}
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">最高標高</div>
                              <div className="font-semibold text-lg">
                                {formatAltitude((report as EmployeeReport).activitySummary.maxAltitude)}
                              </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">標高差</div>
                              <div className="font-semibold text-lg">
                                {formatAltitude((report as EmployeeReport).activitySummary.totalElevationGain)}
                              </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">作業時間</div>
                              <div className="font-semibold text-lg">
                                {(report as EmployeeReport).activitySummary.totalDuration}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="activity" className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center space-x-2">
                            <Activity className="w-4 h-4" />
                            <span>活動タイムライン</span>
                          </h4>
                          <div className="space-y-3">
                            {(report as EmployeeReport).activityData.map((activity, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                                <div className="bg-orange-600 rounded-full p-1">
                                  <Clock className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium text-sm">{activity.timestamp}</div>
                                      <div className="text-sm text-muted-foreground">{activity.activity}</div>
                                    </div>
                                    {activity.location && (
                                      <div className="text-xs text-muted-foreground">
                                        <div>緯度: {activity.location.lat.toFixed(6)}</div>
                                        <div>経度: {activity.location.lng.toFixed(6)}</div>
                                        <div>標高: {activity.location.altitude}m</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="movement" className="space-y-4 mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {renderMovementVisualization(report as EmployeeReport)}
                          {renderAltitudeChart(report as EmployeeReport)}
                        </div>

                        <div>
                          <h5 className="font-medium mb-3">移動データ詳細</h5>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2">時刻</th>
                                  <th className="text-left p-2">標高</th>
                                  <th className="text-left p-2">速度</th>
                                  <th className="text-left p-2">方向</th>
                                  <th className="text-left p-2">距離</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(report as EmployeeReport).movementTrack.slice(0, 10).map((point, index) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{point.timestamp}</td>
                                    <td className="p-2">{point.altitude}m</td>
                                    <td className="p-2">{formatSpeed(point.speed)}</td>
                                    <td className="p-2">{getDirectionText(point.direction)}</td>
                                    <td className="p-2">{formatDistance(point.distanceFromStart / 1000)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {(report as EmployeeReport).movementTrack.length > 10 && (
                              <p className="text-xs text-muted-foreground mt-2">
                                ... 他{(report as EmployeeReport).movementTrack.length - 10}件のデータ点
                              </p>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="sensors" className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-medium mb-3 flex items-center space-x-2">
                            <Navigation className="w-4 h-4" />
                            <span>センサーデータ（iOSデバイス）</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <h5 className="font-medium mb-2">加速度センサー</h5>
                              <div className="space-y-2 text-sm">
                                <div>
                                  X軸: {(report as EmployeeReport).movementTrack[0]?.accelerationX.toFixed(2)} m/s²
                                </div>
                                <div>
                                  Y軸: {(report as EmployeeReport).movementTrack[0]?.accelerationY.toFixed(2)} m/s²
                                </div>
                                <div>
                                  Z軸: {(report as EmployeeReport).movementTrack[0]?.accelerationZ.toFixed(2)} m/s²
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                              <h5 className="font-medium mb-2">コンパス</h5>
                              <div className="space-y-2 text-sm">
                                <div>方向: {(report as EmployeeReport).movementTrack[0]?.direction}°</div>
                                <div>
                                  方角: {getDirectionText((report as EmployeeReport).movementTrack[0]?.direction)}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                            <h5 className="font-medium mb-2">データ収集について</h5>
                            <p className="text-sm text-muted-foreground">
                              このデータは従業員のiOSデバイスから自動的に収集されています。加速度センサーにより移動距離を、
                              コンパスにより移動方向を測定し、GPSデータと組み合わせることで正確な移動軌跡を記録しています。
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}

                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">報告ID: {report.id}</span>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        編集
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        承認
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {reports.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">日報がありません</h3>
                <p className="text-muted-foreground mb-4">新しい日報を作成して、作業記録を管理しましょう</p>
                <Button onClick={() => setShowForm(true)} className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  最初の日報を作成
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
