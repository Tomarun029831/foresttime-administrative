export interface Employee {
    id: string // Uuid
    name: string
    phoneNumber?: string
    email?: string
    department: string
    position: string
    hireDate?: Date
}

export interface APILoginRequest {
    username: string,
    password: string
}

export interface APILoginResponse {
    success: boolean,
    token?: string
}

export interface APITokenCheckRequest { token?: string }
export interface APITokenCheckResponse { success: boolean }

export interface APIGetAllEmployeesRequest { token?: string }
export interface APIGetAllEmployeesResponse { success: boolean, employees?: Employee[] }

export interface APIAddEmployeeRequest { token?: string, newEmployee?: Employee }
export interface APIAddEmployeeResponse { success: boolean }

// ===  ===
export interface Account {
    id: string
    username: string
    password: string // In real app, this would be hashed
    role: "admin"
    createdAt: Date
}

export interface GeoFence {
    id: string
    name: string
    description?: string
    coordinates: {
        latitude: number
        longitude: number
    }[]
    radius: number // in meters
    isActive: boolean
    createdAt: Date
}

export interface ToolType {
    id: string
    name: string
    category: "chainsaw" | "axe" | "safety_equipment" | "measurement" | "other"
    description?: string
}

export interface Tool {
    id: string
    name: string
    toolTypeId: string
    serialNumber?: string
    status: "available" | "in_use" | "maintenance" | "damaged"
    assignedToEmployeeId?: string
    lastMaintenanceDate?: Date
    nextMaintenanceDate?: Date
    createdAt: Date
}

export interface Punch {
    id: string
    employeeId: string // refer to employeeId(Uuid)
    type: "punch_in" | "punch_out"
    timestamp: Date
    location: {
        latitude: number
        longitude: number
    }
    geoFenceId?: string
    toolIds: string[]
    notes?: string
}

export interface WorkReport {
    id: string
    employeeId: string // refer to employeeId(Uuid)
    date: Date
    workType: string
    location: string
    hoursWorked: number
    toolsUsed: string[]
    workDescription: string
    completionStatus: "completed" | "in_progress" | "cancelled"
    supervisorNotes?: string
    createdAt: Date
}

export interface Activity {
    id: string
    employeeId: string
    timestamp: Date
    location: {
        latitude: number
        longitude: number
    }
    accelerometerData: {
        x: number
        y: number
        z: number
    }
    compassHeading: number
    activityType: "walking" | "working" | "resting" | "unknown"
}

export interface Task {
    id: string // Uuid
    timeToBegin: Date
    toolsToWork: Tool[]
    contentOfDuty: string
    currentLocation?: GeoFence // refer to all punch data
    assignedEmployeeId: string
    status: "pending" | "in_progress" | "completed" | "cancelled"
    createdAt: Date
}
