"use client"
export const dynamic = "force-dynamic"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Users, Plus, Edit, Trash2, Search, Phone, Mail, Calendar, Building } from "lucide-react"
import { mockEmployees, mockPunches } from "@/lib/mock-data"
import type { Employee } from "@/lib/types"

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees)
    const [searchTerm, setSearchTerm] = useState("")
    const [departmentFilter, setDepartmentFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    // Filter employees based on search and filters
    const filterEmployees = () => {
        let filtered = employees

        if (searchTerm) {
            filtered = filtered.filter(
                (emp) =>
                    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (departmentFilter !== "all") {
            filtered = filtered.filter((emp) => emp.department === departmentFilter)
        }

        setFilteredEmployees(filtered)
    }

    // Update filters when dependencies change
    useState(() => {
        filterEmployees()
    })

    const CreateEmployeeDialog = () => {
        const [formData, setFormData] = useState({
            name: "",
            employeeNumber: "",
            department: "",
            position: "",
            phoneNumber: "",
            email: "",
            hireDate: "",
        })

        const handleCreate = () => {
            const newEmployee: Employee = {
                id: Date.now().toString(),
                name: formData.name,
                department: formData.department,
                position: formData.position,
                phoneNumber: formData.phoneNumber,
                email: formData.email || undefined,
                hireDate: new Date(formData.hireDate),
            }
            setEmployees([...employees, newEmployee])
            setIsCreateDialogOpen(false)
            setFormData({
                name: "",
                employeeNumber: "",
                department: "",
                position: "",
                phoneNumber: "",
                email: "",
                hireDate: "",
            })
            filterEmployees()
        }

        return (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>新しい従業員を追加</DialogTitle>
                        <DialogDescription>従業員の基本情報を入力してください</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">氏名 *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="田中太郎"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employeeNumber">従業員番号 *</Label>
                            <Input
                                id="employeeNumber"
                                value={formData.employeeNumber}
                                onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                                placeholder="EMP001"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">部署 *</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(value) => setFormData({ ...formData, department: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="部署を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="森林管理部">森林管理部</SelectItem>
                                    <SelectItem value="伐採作業部">伐採作業部</SelectItem>
                                    <SelectItem value="植林作業部">植林作業部</SelectItem>
                                    <SelectItem value="保守管理部">保守管理部</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">役職 *</Label>
                            <Select
                                value={formData.position}
                                onValueChange={(value) => setFormData({ ...formData, position: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="役職を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="主任">主任</SelectItem>
                                    <SelectItem value="作業員">作業員</SelectItem>
                                    <SelectItem value="班長">班長</SelectItem>
                                    <SelectItem value="管理者">管理者</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">電話番号 *</Label>
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="090-1234-5678"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="tanaka@forestry.co.jp"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="hireDate">入社日 *</Label>
                            <Input
                                id="hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                required
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

    const EditEmployeeDialog = () => {
        const [formData, setFormData] = useState({
            name: selectedEmployee?.name || "",
            department: selectedEmployee?.department || "",
            position: selectedEmployee?.position || "",
            phoneNumber: selectedEmployee?.phoneNumber || "",
            email: selectedEmployee?.email || "",
            hireDate: selectedEmployee?.hireDate.toISOString().split("T")[0] || "",
        })

        const handleEdit = () => {
            if (!selectedEmployee) return

            const updatedEmployee: Employee = {
                ...selectedEmployee,
                name: formData.name,
                department: formData.department,
                position: formData.position,
                phoneNumber: formData.phoneNumber,
                email: formData.email || undefined,
                hireDate: new Date(formData.hireDate),
            }

            setEmployees(employees.map((emp) => (emp.id === selectedEmployee.id ? updatedEmployee : emp)))
            setIsEditDialogOpen(false)
            setSelectedEmployee(null)
            filterEmployees()
        }

        return (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>従業員情報を編集</DialogTitle>
                        <DialogDescription>従業員の情報を更新してください</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">氏名 *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-department">部署 *</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(value) => setFormData({ ...formData, department: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="森林管理部">森林管理部</SelectItem>
                                    <SelectItem value="伐採作業部">伐採作業部</SelectItem>
                                    <SelectItem value="植林作業部">植林作業部</SelectItem>
                                    <SelectItem value="保守管理部">保守管理部</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-position">役職 *</Label>
                            <Select
                                value={formData.position}
                                onValueChange={(value) => setFormData({ ...formData, position: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="主任">主任</SelectItem>
                                    <SelectItem value="作業員">作業員</SelectItem>
                                    <SelectItem value="班長">班長</SelectItem>
                                    <SelectItem value="管理者">管理者</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-phoneNumber">電話番号 *</Label>
                            <Input
                                id="edit-phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">メールアドレス</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="edit-hireDate">入社日 *</Label>
                            <Input
                                id="edit-hireDate"
                                type="date"
                                value={formData.hireDate}
                                onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            キャンセル
                        </Button>
                        <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700">
                            更新
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    const deleteEmployee = (employeeId: string) => {
        setEmployees(employees.filter((emp) => emp.id !== employeeId))
        filterEmployees()
    }

    const getEmployeeStats = (employeeId: string) => {
        const employeePunches = mockPunches.filter((punch) => punch.employeeId === employeeId)
        const totalPunches = employeePunches.length
        const lastPunch = employeePunches.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )[0]

        return {
            totalPunches,
            lastActivity: lastPunch ? lastPunch.timestamp.toLocaleDateString() : "なし",
        }
    }

    // Statistics
    const totalEmployees = employees.length
    const departments = [...new Set(employees.map((emp) => emp.department))]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-green-800 mb-2">従業員管理</h2>
                    <p className="text-muted-foreground">林業従事者の情報を管理します</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            新規従業員追加
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">総従業員数</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{totalEmployees}</div>
                        <p className="text-xs text-muted-foreground">人</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">部署数</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{departments.length}</div>
                        <p className="text-xs text-muted-foreground">部署</p>
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
                                placeholder="氏名、従業員番号、メールアドレスで検索..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    filterEmployees()
                                }}
                                className="max-w-sm"
                            />
                        </div>
                        <Select
                            value={departmentFilter}
                            onValueChange={(value) => {
                                setDepartmentFilter(value)
                                filterEmployees()
                            }}
                        >
                            <SelectTrigger className="max-w-xs">
                                <SelectValue placeholder="部署" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">すべての部署</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept} value={dept}>
                                        {dept}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                setStatusFilter(value)
                                filterEmployees()
                            }}
                        >
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Employee List */}
            <Card>
                <CardHeader>
                    <CardTitle>従業員一覧</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>従業員情報</TableHead>
                                <TableHead>部署・役職</TableHead>
                                <TableHead>連絡先</TableHead>
                                <TableHead>入社日</TableHead>
                                <TableHead>活動状況</TableHead>
                                <TableHead>操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.map((employee) => {
                                const stats = getEmployeeStats(employee.id)
                                return (
                                    <TableRow key={employee.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{employee.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">{employee.department}</p>
                                                <p className="text-xs text-muted-foreground">{employee.position}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="w-3 h-3" />
                                                    {employee.phoneNumber}
                                                </div>
                                                {employee.email && (
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <Mail className="w-3 h-3" />
                                                        {employee.email}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="w-3 h-3" />
                                                {employee.hireDate.toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <p>打刻回数: {stats.totalPunches}</p>
                                                <p className="text-xs text-muted-foreground">最終: {stats.lastActivity}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setSelectedEmployee(employee)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => deleteEmployee(employee.id)}>
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

            <CreateEmployeeDialog />
            <EditEmployeeDialog />
        </div>
    )
}
