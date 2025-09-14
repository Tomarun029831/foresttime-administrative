"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, MapPin, User, Filter, Download, RefreshCw, CheckCircle2, Timer, Thermometer, Cloud } from "lucide-react"
// import { mockEmployees, mockPunches, mockGeoFences, mockTools } from "@/lib/mock-data"
import type { CircularGeoFence, Employee, Punch, WorkingSession } from "@/lib/types"
import { timeFormatJPHM } from "@/lib/utils"


interface AttendanceMonitoringUIProps { employees?: Employee[], fetchedworkingsessions?: WorkingSession[], fetchedareas?: CircularGeoFence[] }
export default function AttendanceMonitoringUI({ employees = [], fetchedworkingsessions = [], fetchedareas = [] }: AttendanceMonitoringUIProps) {
    const [workingsessions, setWorkingsessions] = useState<WorkingSession[]>(fetchedworkingsessions)
    const [filteredWorkingsessions, setFilteredWorkingsessions] = useState<WorkingSession[]>(fetchedworkingsessions)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterDate, setFilterDate] = useState("")
    const [filterType, setFilterType] = useState<"all" | "punch_in" | "punch_out">("all")
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Filter punches based on search and filters
    useEffect(() => {
        let filtered = workingsessions

        if (searchTerm) {
            filtered = filtered.filter((session) => {
                const employee = employees.find((emp) => emp.id === session.user_id)
                return (
                    employee?.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            })
        }

        if (filterDate) {
            filtered = filtered.filter((punch) => {
                const punchDate = new Date(punch.start_time).toISOString().split("T")[0]
                return punchDate === filterDate
            })
        }

        if (filterType !== "all") {
            filtered = filtered.filter((punch) => punch.session_status === filterType)
        }

        setFilteredWorkingsessions(filtered)
    }, [workingsessions, searchTerm, filterDate, filterType])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setIsRefreshing(false)
    }

    const exportData = () => {
        // // Simulate CSV export
        // const csvData = filteredPunches.map((punch) => {
        //     const employee = mockEmployees.find((emp) => emp.id === punch.employeeId)
        //     const geoFence = mockGeoFences.find((fence) => fence.id === punch.geoFenceId)
        //     return {
        //         従業員名: employee?.name,
        //         打刻種別: punch.type === "punch_in" ? "出勤" : "退勤",
        //         日時: punch.timestamp.toLocaleString(),
        //         場所: geoFence?.name || "不明",
        //         緯度: punch.location.latitude,
        //         経度: punch.location.longitude,
        //         備考: punch.notes,
        //     }
        // })
        console.log("CSV Export:")
        alert("勤怠データをエクスポートしました")
    }

    // Calculate current status for each employee
    const getEmployeeStatus = (employeeId: string) => {
        const sessions = workingsessions
            .filter((session) => session.user_id === employeeId)
            .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

        const latestPunch = sessions[0]
        if (!latestPunch) return { status: "未打刻", color: "gray" }

        const today = new Date().toDateString()
        const punchDate = new Date(latestPunch.start_time).toDateString()

        if (punchDate !== today) return { status: "未打刻", color: "gray" }

        return latestPunch.session_status === "punch_in"
            ? { status: "勤務中", color: "green" }
            : { status: "退勤済み", color: "blue" }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">勤怠監視</h2>
                    <p className="text-muted-foreground">リアルタイムで従業員の勤怠状況を監視します</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                        更新
                    </Button>
                    <Button onClick={exportData} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        エクスポート
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            現在の打刻状況
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {employees.map((employee) => {
                                const status = getEmployeeStatus(employee.id)
                                return (
                                    <div key={employee.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <div>
                                            <p className="font-medium">{employee.name}</p>
                                        </div>
                                        <Badge
                                            variant={status.color === "green" ? "default" :
                                                status.color === "blue" ? "secondary" :
                                                    "outline"}
                                            className={status.color === "green" ? "bg-green-600" : ""}
                                        >
                                            {status.status}
                                        </Badge>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            今日の打刻活動
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {workingsessions.slice(0, 10).map((session) => {
                                const employee = employees.find((emp) => emp.id === session.user_id)
                                const geoFence = fetchedareas.find((fence) => fence.name === session.work_area)
                                return (
                                    <div key={session.session_id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                                        <div
                                            className={`w-2 h-2 rounded-full mt-2 ${session.session_status === "punch_in" ? "bg-green-500" : "bg-blue-500"}`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{employee?.name}</p>
                                                <span className="text-xs text-muted-foreground">
                                                    {session.start_time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {session.session_status === "punch_in" ? "出勤" : "退勤"} - {geoFence?.name}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        打刻記録一覧
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                            <Input
                                placeholder="従業員名または従業員番号で検索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <Input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="max-w-xs"
                        />
                        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                            <SelectTrigger className="max-w-xs">
                                <SelectValue placeholder="打刻種別" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">すべて</SelectItem>
                                <SelectItem value="punch_in">出勤</SelectItem>
                                <SelectItem value="punch_out">退勤</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>従業員</TableHead>
                                <TableHead>種別</TableHead>
                                <TableHead>日時</TableHead>
                                <TableHead>場所</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWorkingsessions.map((session) => {
                                const employee = employees.find((emp) => emp.id === session.user_id)
                                const geoFence = fetchedareas.find((fence) => fence.name === session.work_area)
                                return (
                                    <TableRow key={session.session_id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{employee?.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={session.session_status === "punch_in" ? "default" : "secondary"}>
                                                {session.session_status === "punch_in" ? "出勤" : "退勤"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p>{session.start_time}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {session.start_time}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {geoFence?.name || "不明"}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
