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
  Wrench,
  Plus,
  Trash2,
  Search,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Package,
} from "lucide-react"
import { mockTools, mockToolTypes, mockEmployees } from "@/lib/mock-data"
import type { Tool, ToolType } from "@/lib/types"

export function ToolManagement() {
  const [tools, setTools] = useState<Tool[]>(mockTools)
  const [toolTypes, setToolTypes] = useState<ToolType[]>(mockToolTypes)
  const [filteredTools, setFilteredTools] = useState<Tool[]>(mockTools)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateTypeDialogOpen, setIsCreateTypeDialogOpen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)

  // Filter tools based on search and filters
  const filterTools = () => {
    let filtered = tools

    if (searchTerm) {
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tool.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((tool) => tool.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      const toolType = toolTypes.find((type) => type.id === categoryFilter)
      if (toolType) {
        filtered = filtered.filter((tool) => tool.toolTypeId === toolType.id)
      }
    }

    setFilteredTools(filtered)
  }

  // Update filters when dependencies change
  useState(() => {
    filterTools()
  })

  const CreateToolDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      toolTypeId: "default", // Updated value to be a non-empty string
      serialNumber: "",
      assignedToEmployeeId: "",
      lastMaintenanceDate: "",
      nextMaintenanceDate: "",
    })

    const handleCreate = () => {
      const newTool: Tool = {
        id: Date.now().toString(),
        name: formData.name,
        toolTypeId: formData.toolTypeId,
        serialNumber: formData.serialNumber || undefined,
        status: formData.assignedToEmployeeId ? "in_use" : "available",
        assignedToEmployeeId: formData.assignedToEmployeeId || undefined,
        lastMaintenanceDate: formData.lastMaintenanceDate ? new Date(formData.lastMaintenanceDate) : undefined,
        nextMaintenanceDate: formData.nextMaintenanceDate ? new Date(formData.nextMaintenanceDate) : undefined,
        createdAt: new Date(),
      }
      setTools([...tools, newTool])
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        toolTypeId: "default", // Updated value to be a non-empty string
        serialNumber: "",
        assignedToEmployeeId: "",
        lastMaintenanceDate: "",
        nextMaintenanceDate: "",
      })
      filterTools()
    }

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新しい道具を追加</DialogTitle>
            <DialogDescription>道具の基本情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">道具名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="チェーンソー CS-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="toolTypeId">道具種別 *</Label>
              <Select
                value={formData.toolTypeId}
                onValueChange={(value) => setFormData({ ...formData, toolTypeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  {toolTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serialNumber">シリアル番号</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                placeholder="CS001234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedToEmployeeId">割り当て従業員</Label>
              <Select
                value={formData.assignedToEmployeeId}
                onValueChange={(value) => setFormData({ ...formData, assignedToEmployeeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="従業員を選択（任意）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">割り当てなし</SelectItem>
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
              <Label htmlFor="lastMaintenanceDate">最終メンテナンス日</Label>
              <Input
                id="lastMaintenanceDate"
                type="date"
                value={formData.lastMaintenanceDate}
                onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextMaintenanceDate">次回メンテナンス予定日</Label>
              <Input
                id="nextMaintenanceDate"
                type="date"
                value={formData.nextMaintenanceDate}
                onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const CreateToolTypeDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      category: "other" as const,
      description: "",
    })

    const handleCreate = () => {
      const newToolType: ToolType = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        description: formData.description || undefined,
      }
      setToolTypes([...toolTypes, newToolType])
      setIsCreateTypeDialogOpen(false)
      setFormData({
        name: "",
        category: "other",
        description: "",
      })
    }

    return (
      <Dialog open={isCreateTypeDialogOpen} onOpenChange={setIsCreateTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しい道具種別を追加</DialogTitle>
            <DialogDescription>道具種別の情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type-name">種別名 *</Label>
              <Input
                id="type-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: 電動ドリル"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: any) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chainsaw">チェーンソー</SelectItem>
                  <SelectItem value="axe">斧・手斧</SelectItem>
                  <SelectItem value="safety_equipment">安全装備</SelectItem>
                  <SelectItem value="measurement">測量器具</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type-description">説明</Label>
              <Textarea
                id="type-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="道具種別の詳細説明"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCreateTypeDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const updateToolStatus = (toolId: string, newStatus: Tool["status"], employeeId?: string) => {
    setTools(
      tools.map((tool) =>
        tool.id === toolId
          ? {
              ...tool,
              status: newStatus,
              assignedToEmployeeId: newStatus === "in_use" ? employeeId : undefined,
            }
          : tool,
      ),
    )
    filterTools()
  }

  const deleteTool = (toolId: string) => {
    setTools(tools.filter((tool) => tool.id !== toolId))
    filterTools()
  }

  const getStatusColor = (status: Tool["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-600"
      case "in_use":
        return "bg-blue-600"
      case "maintenance":
        return "bg-yellow-600"
      case "damaged":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusLabel = (status: Tool["status"]) => {
    switch (status) {
      case "available":
        return "利用可能"
      case "in_use":
        return "使用中"
      case "maintenance":
        return "メンテナンス中"
      case "damaged":
        return "故障"
      default:
        return "不明"
    }
  }

  const getMaintenanceStatus = (tool: Tool) => {
    if (!tool.nextMaintenanceDate) return null

    const today = new Date()
    const nextMaintenance = new Date(tool.nextMaintenanceDate)
    const daysUntil = Math.ceil((nextMaintenance.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntil < 0) return { status: "overdue", label: "期限切れ", color: "text-red-600" }
    if (daysUntil <= 7) return { status: "due_soon", label: "要注意", color: "text-yellow-600" }
    return { status: "ok", label: "正常", color: "text-green-600" }
  }

  // Statistics
  const totalTools = tools.length
  const availableTools = tools.filter((tool) => tool.status === "available").length
  const inUseTools = tools.filter((tool) => tool.status === "in_use").length
  const maintenanceTools = tools.filter((tool) => tool.status === "maintenance").length
  const damagedTools = tools.filter((tool) => tool.status === "damaged").length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">道具管理</h2>
          <p className="text-muted-foreground">林業作業用の道具・機材を管理します</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateTypeDialogOpen} onOpenChange={setIsCreateTypeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                種別追加
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                新規道具追加
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総道具数</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalTools}</div>
            <p className="text-xs text-muted-foreground">個</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">利用可能</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableTools}</div>
            <p className="text-xs text-muted-foreground">個</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">使用中</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inUseTools}</div>
            <p className="text-xs text-muted-foreground">個</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">メンテナンス</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceTools}</div>
            <p className="text-xs text-muted-foreground">個</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">故障</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{damagedTools}</div>
            <p className="text-xs text-muted-foreground">個</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            検索・フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="道具名またはシリアル番号で検索..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  filterTools()
                }}
                className="max-w-sm"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                filterTools()
              }}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="状態" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての状態</SelectItem>
                <SelectItem value="available">利用可能</SelectItem>
                <SelectItem value="in_use">使用中</SelectItem>
                <SelectItem value="maintenance">メンテナンス中</SelectItem>
                <SelectItem value="damaged">故障</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value)
                filterTools()
              }}
            >
              <SelectTrigger className="max-w-xs">
                <SelectValue placeholder="種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての種別</SelectItem>
                {toolTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tools List */}
      <Card>
        <CardHeader>
          <CardTitle>道具一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>道具情報</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>割り当て</TableHead>
                <TableHead>メンテナンス</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.map((tool) => {
                const toolType = toolTypes.find((type) => type.id === tool.toolTypeId)
                const assignedEmployee = tool.assignedToEmployeeId
                  ? mockEmployees.find((emp) => emp.id === tool.assignedToEmployeeId)
                  : null
                const maintenanceStatus = getMaintenanceStatus(tool)

                return (
                  <TableRow key={tool.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tool.name}</p>
                        {tool.serialNumber && <p className="text-sm text-muted-foreground">S/N: {tool.serialNumber}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{toolType?.name}</p>
                        <p className="text-xs text-muted-foreground">{toolType?.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      {assignedEmployee ? (
                        <div>
                          <p className="text-sm font-medium">{assignedEmployee.name}</p>
                          <p className="text-xs text-muted-foreground">{assignedEmployee.employeeNumber}</p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">未割り当て</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tool.nextMaintenanceDate ? (
                        <div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="text-sm">{tool.nextMaintenanceDate.toLocaleDateString()}</span>
                          </div>
                          {maintenanceStatus && (
                            <p className={`text-xs ${maintenanceStatus.color}`}>{maintenanceStatus.label}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">未設定</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Select
                          value={tool.status}
                          onValueChange={(value: Tool["status"]) => updateToolStatus(tool.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">利用可能</SelectItem>
                            <SelectItem value="in_use">使用中</SelectItem>
                            <SelectItem value="maintenance">メンテナンス</SelectItem>
                            <SelectItem value="damaged">故障</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" onClick={() => deleteTool(tool.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateToolDialog />
      <CreateToolTypeDialog />
    </div>
  )
}
