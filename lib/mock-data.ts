import type { Account, Employee, GeoFence, ToolType, Tool, Punch, WorkReport } from "./types"

// Mock data for development
export const mockAccounts: Account[] = [
  {
    id: "1",
    username: "admin",
    password: "admin123", // In real app, this would be hashed
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
]

export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "田中太郎",
    employeeNumber: "EMP001",
    department: "森林管理部",
    position: "主任",
    phoneNumber: "090-1234-5678",
    email: "tanaka@forestry.co.jp",
    hireDate: new Date("2020-04-01"),
    isActive: true,
  },
  {
    id: "2",
    name: "佐藤花子",
    employeeNumber: "EMP002",
    department: "森林管理部",
    position: "作業員",
    phoneNumber: "090-2345-6789",
    hireDate: new Date("2021-06-15"),
    isActive: true,
  },
  {
    id: "3",
    name: "鈴木一郎",
    employeeNumber: "EMP003",
    department: "森林管理部",
    position: "作業員",
    phoneNumber: "090-3456-7890",
    hireDate: new Date("2022-03-10"),
    isActive: true,
  },
]

export const mockGeoFences: GeoFence[] = [
  {
    id: "1",
    name: "北山作業エリア",
    description: "北山の伐採作業区域",
    coordinates: [
      { latitude: 35.6762, longitude: 139.6503 },
      { latitude: 35.6772, longitude: 139.6513 },
      { latitude: 35.6782, longitude: 139.6503 },
      { latitude: 35.6772, longitude: 139.6493 },
    ],
    radius: 100,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "南山作業エリア",
    description: "南山の植林作業区域",
    coordinates: [
      { latitude: 35.6662, longitude: 139.6403 },
      { latitude: 35.6672, longitude: 139.6413 },
      { latitude: 35.6682, longitude: 139.6403 },
      { latitude: 35.6672, longitude: 139.6393 },
    ],
    radius: 150,
    isActive: true,
    createdAt: new Date("2024-01-20"),
  },
]

export const mockToolTypes: ToolType[] = [
  { id: "1", name: "チェーンソー", category: "chainsaw", description: "木材伐採用" },
  { id: "2", name: "手斧", category: "axe", description: "枝打ち用" },
  { id: "3", name: "ヘルメット", category: "safety_equipment", description: "安全装備" },
  { id: "4", name: "測量器", category: "measurement", description: "距離測定用" },
]

export const mockTools: Tool[] = [
  {
    id: "1",
    name: "チェーンソー CS-001",
    toolTypeId: "1",
    serialNumber: "CS001234",
    status: "available",
    lastMaintenanceDate: new Date("2024-01-01"),
    nextMaintenanceDate: new Date("2024-04-01"),
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "2",
    name: "チェーンソー CS-002",
    toolTypeId: "1",
    serialNumber: "CS002345",
    status: "in_use",
    assignedToEmployeeId: "1",
    lastMaintenanceDate: new Date("2024-01-15"),
    nextMaintenanceDate: new Date("2024-04-15"),
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "3",
    name: "ヘルメット H-001",
    toolTypeId: "3",
    serialNumber: "H001234",
    status: "available",
    createdAt: new Date("2023-12-01"),
  },
]

export const mockPunches: Punch[] = [
  {
    id: "1",
    employeeId: "1",
    type: "punch_in",
    timestamp: new Date("2024-01-25T08:00:00"),
    location: { latitude: 35.6762, longitude: 139.6503 },
    geoFenceId: "1",
    toolIds: ["2"],
    notes: "北山エリアでの伐採作業開始",
    weather: "晴れ",
    temperature: 15,
  },
  {
    id: "2",
    employeeId: "2",
    type: "punch_in",
    timestamp: new Date("2024-01-25T08:15:00"),
    location: { latitude: 35.6662, longitude: 139.6403 },
    geoFenceId: "2",
    toolIds: ["3"],
    notes: "南山エリアでの植林作業開始",
    weather: "晴れ",
    temperature: 15,
  },
]

export const mockWorkReports: WorkReport[] = [
  {
    id: "1",
    employeeId: "1",
    date: new Date("2024-01-24"),
    workType: "伐採作業",
    location: "北山作業エリア",
    hoursWorked: 8,
    toolsUsed: ["チェーンソー CS-002"],
    workDescription: "スギ材の伐採作業を実施。予定通り10本の伐採を完了。",
    completionStatus: "completed",
    supervisorNotes: "作業効率良好",
    createdAt: new Date("2024-01-24T17:00:00"),
  },
  {
    id: "2",
    employeeId: "2",
    date: new Date("2024-01-24"),
    workType: "植林作業",
    location: "南山作業エリア",
    hoursWorked: 7.5,
    toolsUsed: ["手斧", "ヘルメット H-001"],
    workDescription: "ヒノキの苗木50本を植林。土壌状態良好。",
    completionStatus: "completed",
    createdAt: new Date("2024-01-24T16:30:00"),
  },
]
