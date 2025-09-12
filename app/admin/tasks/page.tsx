"use client"
export const dynamic = "force-dynamic"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Calendar, MapPin, Wrench, User, Clock } from "lucide-react"
import type { Task } from "@/lib/types"
import { mockEmployees, mockTools, mockGeoFences } from "@/lib/mock-data"

// Mock task data
const mockTasks: Task[] = [
    {
        id: "task-1",
        timeToBegin: new Date("2024-01-15T08:00:00"),
        toolsToWork: [mockTools[0], mockTools[1]].filter(Boolean),
        contentOfDuty: "北側エリアの間伐作業",
        currentLocation: mockGeoFences[0],
        assignedEmployeeId: "emp-1",
        status: "pending",
        createdAt: new Date("2024-01-14T10:00:00"),
    },
    {
        id: "task-2",
        timeToBegin: new Date("2024-01-15T09:30:00"),
        toolsToWork: [mockTools[2]].filter(Boolean),
        contentOfDuty: "安全点検および機材メンテナンス",
        currentLocation: mockGeoFences[1],
        assignedEmployeeId: "emp-2",
        status: "in_progress",
        createdAt: new Date("2024-01-14T11:00:00"),
    },
    {
        id: "task-3",
        timeToBegin: new Date("2024-01-15T13:00:00"),
        toolsToWork: [mockTools[0], mockTools[3]].filter(Boolean),
        contentOfDuty: "南側エリアの植林準備",
        currentLocation: mockGeoFences[2],
        assignedEmployeeId: "emp-3",
        status: "completed",
        createdAt: new Date("2024-01-14T12:00:00"),
    },
]

export default function TaskManagement() {
    const [tasks, setTasks] = useState<Task[]>(mockTasks)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newTask, setNewTask] = useState({
        timeToBegin: "",
        contentOfDuty: "",
        assignedEmployeeId: "",
        currentLocationId: "",
        selectedToolIds: [] as string[],
    })

    const getStatusBadge = (status: Task["status"]) => {
        switch (status) {
            case "pending":
                return <Badge variant="secondary">待機中</Badge>
            case "in_progress":
                return (
                    <Badge variant="default" className="bg-blue-600">
                        進行中
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="default" className="bg-green-600">
                        完了
                    </Badge>
                )
            case "cancelled":
                return <Badge variant="destructive">キャンセル</Badge>
            default:
                return <Badge variant="outline">不明</Badge>
        }
    }

    const handleCreateTask = () => {
        const selectedTools = mockTools.filter((tool) => newTask.selectedToolIds.includes(tool.id))
        const selectedLocation = mockGeoFences.find((fence) => fence.id === newTask.currentLocationId)

        const task: Task = {
            id: `task-${Date.now()}`,
            timeToBegin: new Date(newTask.timeToBegin),
            toolsToWork: selectedTools.filter(Boolean),
            contentOfDuty: newTask.contentOfDuty,
            currentLocation: selectedLocation,
            assignedEmployeeId: newTask.assignedEmployeeId,
            status: "pending",
            createdAt: new Date(),
        }

        setTasks([...tasks, task])
        setIsCreateDialogOpen(false)
        setNewTask({
            timeToBegin: "",
            contentOfDuty: "",
            assignedEmployeeId: "",
            currentLocationId: "",
            selectedToolIds: [],
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">タスク管理</h2>
                    <p className="text-muted-foreground">作業タスクの管理と進捗追跡</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            新しいタスクを作成
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>新しいタスクを作成</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="timeToBegin">開始予定時刻</Label>
                                <Input
                                    id="timeToBegin"
                                    type="datetime-local"
                                    value={newTask.timeToBegin}
                                    onChange={(e) => setNewTask({ ...newTask, timeToBegin: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="assignedEmployee">担当従業員</Label>
                                <Select
                                    value={newTask.assignedEmployeeId}
                                    onValueChange={(value) => setNewTask({ ...newTask, assignedEmployeeId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="従業員を選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockEmployees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="location">作業場所</Label>
                                <Select
                                    value={newTask.currentLocationId}
                                    onValueChange={(value) => setNewTask({ ...newTask, currentLocationId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="作業エリアを選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockGeoFences.map((fence) => (
                                            <SelectItem key={fence.id} value={fence.id}>
                                                {fence.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>使用道具</Label>
                                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                                    <div className="space-y-2">
                                        {mockTools.map((tool) => (
                                            <div key={tool.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`tool-${tool.id}`}
                                                    checked={newTask.selectedToolIds.includes(tool.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewTask({
                                                                ...newTask,
                                                                selectedToolIds: [...newTask.selectedToolIds, tool.id],
                                                            })
                                                        } else {
                                                            setNewTask({
                                                                ...newTask,
                                                                selectedToolIds: newTask.selectedToolIds.filter((id) => id !== tool.id),
                                                            })
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                                <label
                                                    htmlFor={`tool-${tool.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {tool.name}
                                                </label>
                                                <Badge variant="outline" className="text-xs ml-auto">
                                                    {tool.status === "available"
                                                        ? "利用可能"
                                                        : tool.status === "in_use"
                                                            ? "使用中"
                                                            : tool.status === "maintenance"
                                                                ? "メンテナンス中"
                                                                : "故障"}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {newTask.selectedToolIds.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {newTask.selectedToolIds.length}個の道具が選択されています
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="contentOfDuty">作業内容</Label>
                                <Textarea
                                    id="contentOfDuty"
                                    placeholder="作業内容を入力してください"
                                    value={newTask.contentOfDuty}
                                    onChange={(e) => setNewTask({ ...newTask, contentOfDuty: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleCreateTask} className="w-full bg-green-600 hover:bg-green-700">
                                タスクを作成
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        タスク一覧
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tasks.map((task) => {
                            const employee = mockEmployees.find((emp) => emp.id === task.assignedEmployeeId)
                            return (
                                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm text-muted-foreground">ID: {task.id}</span>
                                        </div>
                                        {getStatusBadge(task.status)}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>開始予定: {task.timeToBegin.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span>担当者: {employee?.name || "未割り当て"}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>場所: {task.currentLocation?.name || "未設定"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Wrench className="h-4 w-4 text-muted-foreground" />
                                                <span>使用道具:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {task.toolsToWork.filter(Boolean).map((tool) => (
                                                    <Badge key={tool.id} variant="outline" className="text-xs">
                                                        {tool?.name || "不明な道具"}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t">
                                        <p className="text-sm font-medium mb-1">作業内容:</p>
                                        <p className="text-sm text-muted-foreground">{task.contentOfDuty}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
