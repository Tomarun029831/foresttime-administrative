"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    MapPin,
    Clock,
    Wrench,
    AlertTriangle,
    CheckCircle,
} from "lucide-react"
import { mockEmployees, mockPunches, mockTools, mockGeoFences } from "@/lib/mock-data"

type ActiveView = "overview" | "geofence" | "attendance" | "employees" | "tasks" | "tools" | "reports"
export default function AdminDashboard() {
    const [activeView, setActiveView] = useState<ActiveView>("overview")
    // HACK: const activeEmployees = mockEmployees.filter((emp) => emp.isActive).length
    const todayPunches = mockPunches.filter((punch) => {
        const today = new Date()
        const punchDate = new Date(punch.timestamp)
        return punchDate.toDateString() === today.toDateString()
    }).length
    const availableTools = mockTools.filter((tool) => tool.status === "available").length
    const activeGeoFences = mockGeoFences.filter((fence) => fence.isActive).length

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
                        {/* <div className="text-2xl font-bold text-green-600">{activeEmployees}</div> */}
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
}
