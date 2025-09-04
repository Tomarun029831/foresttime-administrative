"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  Eye,
} from "lucide-react"
import { mockWorkReports, mockEmployees, mockTools, mockGeoFences } from "@/lib/mock-data"
import type { WorkReport } from "@/lib/types"

export function DailyReports() {
  const [reports, setReports] = useState<WorkReport[]>(mockWorkReports)
  const [filteredReports, setFilteredReports] = useState<WorkReport[]>(mockWorkReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [employeeFilter, setEmployeeFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<WorkReport | null>(null)

  // Filter reports based on search and filters
  const filterReports = () => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.workDescription.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (dateFilter) {
      filtered = filtered.filter((report) => {
        const reportDate = new Date(report.date).toISOString().split("T")[0]
        return reportDate === dateFilter
      })
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.completionStatus === statusFilter)
    }

    if (employeeFilter !== "all") {
      filtered = filtered.filter((report) => report.employeeId === employeeFilter)
    }

    setFilteredReports(filtered)
  }

  // Update filters when dependencies change
  useState(() => {
    filterReports()
  })

  const CreateReportDialog = () => {
    const [formData, setFormData] = useState({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      workType: "",
      location: "",
      hoursWorked: "",
      toolsUsed: [] as string[],
      workDescription: "",
      completionStatus: "completed" as const,
      supervisorNotes: "",
    })

    const handleCreate = () => {
      const newReport: WorkReport = {
        id: Date.now().toString(),
        employeeId: formData.employeeId,
        date: new Date(formData.date),
        workType: formData.workType,
        location: formData.location,
        hoursWorked: Number(formData.hoursWorked),
        toolsUsed: formData.toolsUsed,
        workDescription: formData.workDescription,
        completionStatus: formData.completionStatus,
        supervisorNotes: formData.supervisorNotes || undefined,
        createdAt: new Date(),
      }
      setReports([newReport, ...reports])
      setIsCreateDialogOpen(false)
      setFormData({
        employeeId: "",
        date: new Date().toISOString().split("T")[0],
        workType: "",
        location: "",
        hoursWorked: "",
        toolsUsed: [],
        workDescription: "",
        completionStatus: "completed",
        supervisorNotes: "",
      })
      filterReports()
    }

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>新しい日報を作成</DialogTitle>
            <DialogDescription>作業日報の詳細情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">従業員 *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="従業員を選択" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter((emp) => emp.isActive)
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} ({employee.employeeNumber})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">作業日 *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workType">作業種別 *</Label>
              <Select
                value={formData.workType}
                onValueChange={(value) => setFormData({ ...formData, workType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="作業種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="伐採作業">伐採作業</SelectItem>
                  <SelectItem value="植林作業">植林作業</SelectItem>
                  <SelectItem value="枝打ち作業">枝打ち作業</SelectItem>
                  <SelectItem value="間伐作業">間伐作業</SelectItem>
                  <SelectItem value="道路整備">道路整備</SelectItem>
                  <SelectItem value="測量作業">測量作業</SelectItem>
                  <SelectItem value="メンテナンス">メンテナンス</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">作業場所 *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="作業場所を選択" />
                </SelectTrigger>
                <SelectContent>
                  {mockGeoFences.map((fence) => (
                    <SelectItem key={fence.id} value={fence.name}>
                      {fence.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursWorked">作業時間 *</Label>
              <Input
                id="hoursWorked"
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                placeholder="8.0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completionStatus">完了状況 *</Label>
              <Select
                value={formData.completionStatus}
                onValueChange={(value: any) => setFormData({ ...formData, completionStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">完了</SelectItem>
                  <SelectItem value="in_progress">進行中</SelectItem>
                  <SelectItem value="cancelled">中止</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="toolsUsed">使用道具</Label>
              <div className="grid grid-cols-3 gap-2">
                {mockTools.slice(0, 6).map((tool) => (
                  <label key={tool.id} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.toolsUsed.includes(tool.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, toolsUsed: [...formData.toolsUsed, tool.name] })
                        } else {
                          setFormData({
                            ...formData,
                            toolsUsed: formData.toolsUsed.filter((t) => t !== tool.name),
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <span>{tool.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="workDescription">作業内容 *</Label>
              <Textarea
                id="workDescription"
                value={formData.workDescription}
                onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                placeholder="本日の作業内容を詳しく記載してください..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="supervisorNotes">管理者メモ</Label>
              <Textarea
                id="supervisorNotes"
                value={formData.supervisorNotes}
                onChange={(e) => setFormData({ ...formData, supervisorNotes: e.target.value })}
                placeholder="管理者からのコメントや指示事項..."
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              作成
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const ViewReportDialog = () => {
    if (!selectedReport) return null

    const employee = mockEmployees.find((emp) => emp.id === selectedReport.employeeId)

    return (
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>日報詳細</DialogTitle>
            <DialogDescription>
              {employee?.name} - {selectedReport.date.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">従業員</Label>
                <p className="text-sm">
                  {employee?.name} ({employee?.employeeNumber})
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">作業日</Label>
                <p className="text-sm">{selectedReport.date.toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">作業種別</Label>
                <p className="text-sm">{selectedReport.workType}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">作業場所</Label>
                <p className="text-sm">{selectedReport.location}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">作業時間</Label>
                <p className="text-sm">{selectedReport.hoursWorked}時間</p>
              </div>
              <div>
                <Label className="text-sm font-medium">完了状況</Label>
                <Badge
                  variant={
                    selectedReport.completionStatus === "completed"
                      ? "default"
                      : selectedReport.completionStatus === "in_progress"
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    selectedReport.completionStatus === "completed"
                      ? "bg-green-600"
                      : selectedReport.completionStatus === "in_progress"
                        ? "bg-blue-600"
                        : ""
                  }
                >
                  {selectedReport.completionStatus === "completed"
                    ? "完了"
                    : selectedReport.completionStatus === "in_progress"
                      ? "進行中"
                      : "中止"}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">使用道具</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedReport.toolsUsed.map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">作業内容</Label>
              <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedReport.workDescription}</p>
            </div>
            {selectedReport.supervisorNotes && (
              <div>
                <Label className="text-sm font-medium">管理者メモ</Label>
                <p className="text-sm mt-1 p-3 bg-blue-50 rounded-lg">{selectedReport.supervisorNotes}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">作成日時</Label>
              <p className="text-sm">{selectedReport.createdAt.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const exportReports = () => {
    // Simulate CSV export
    const csvData = filteredReports.map((report) => {
      const employee = mockEmployees.find((emp) => emp.id === report.employeeId)
      return {
        従業員名: employee?.name,
        従業員番号: employee?.employeeNumber,
        作業日: report.date.toLocaleDateString(),
        作業種別: report.workType,
        作業場所: report.location,
        作業時間: report.hoursWorked,
        使用道具: report.toolsUsed.join(", "),
        作業内容: report.workDescription,
        完了状況:
          report.completionStatus === "completed"
            ? "完了"
            : report.completionStatus === "in_progress"
              ? "進行中"
              : "中止",
        管理者メモ: report.supervisorNotes || "",
        作成日時: report.createdAt.toLocaleString(),
      }
    })
    console.log("CSV Export:", csvData)
    alert("日報データをエクスポートしました")
  }

  const getStatusColor = (status: WorkReport["completionStatus"]) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "in_progress":
        return "bg-blue-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusLabel = (status: WorkReport["completionStatus"]) => {
    switch (status) {
      case "completed":
        return "完了"
      case "in_progress":
        return "進行中"
      case "cancelled":
        return "中止"
      default:
        return "不明"
    }
  }

  // Statistics
  const totalReports = reports.length
  const completedReports = reports.filter((report) => report.completionStatus === "completed").length
  const inProgressReports = reports.filter((report) => report.completionStatus === "in_progress").length
  const totalHours = reports.reduce((sum, report) => sum + report.hoursWorked, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">日報管理</h2>
          <p className="text-muted-foreground">林業作業の日報を管理・閲覧します</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportReports} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            エクスポート
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                新規日報作成
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総日報数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalReports}</div>
            <p className="text-xs text-muted-foreground">件</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完了作業</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedReports}</div>
            <p className="text-xs text-muted-foreground">件</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">進行中作業</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressReports}</div>
            <p className="text-xs text-muted-foreground">件</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総作業時間</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalHours}</div>
            <p className="text-xs text-muted-foreground">時間</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            検索・フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="作業種別、場所、内容で検索..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                filterReports()
              }}
            />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                filterReports()
              }}
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                filterReports()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="完了状況" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="completed">完了</SelectItem>
                <SelectItem value="in_progress">進行中</SelectItem>
                <SelectItem value="cancelled">中止</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={employeeFilter}
              onValueChange={(value) => {
                setEmployeeFilter(value)
                filterReports()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="従業員" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての従業員</SelectItem>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>日報一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>従業員</TableHead>
                <TableHead>作業日</TableHead>
                <TableHead>作業種別</TableHead>
                <TableHead>場所</TableHead>
                <TableHead>時間</TableHead>
                <TableHead>状況</TableHead>
                <TableHead>作業内容</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const employee = mockEmployees.find((emp) => emp.id === report.employeeId)
                return (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <div>
                          <p className="font-medium">{employee?.name}</p>
                          <p className="text-sm text-muted-foreground">{employee?.employeeNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{report.workType}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {report.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {report.hoursWorked}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.completionStatus)}>
                        {getStatusLabel(report.completionStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm truncate">{report.workDescription}</p>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedReport(report)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateReportDialog />
      <ViewReportDialog />
    </div>
  )
}
