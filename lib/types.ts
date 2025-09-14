export interface Employee {
    id: string // Uuid
    name: string
    phoneNumber?: string
    email?: string
    department: string
    position: string
    hireDate?: Date
}

export interface WorkingSession {
    session_id: string
    user_id: string
    work_area: string
    start_time: string
    end_time: string
    total_work_duration: string
    total_break_time: string
    step_count: number
    distance_traveled: string
    sync_timestamp: string
    device_info: string
    weather_info: string
    session_status: string
}
export interface APIGetAllWorksessionsRequest { }
export interface APIGetAllWorksessionsResponse { success: boolean, workingSessions?: WorkingSession[] }

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
export interface APIDeleteEmployeeRequest { token?: string, employeeId?: string }
export interface APIDeleteEmployeeResponse { success: boolean }

// workarea
export interface CircularGeoFence {
    id: string
    name: string
    center: { lat: number; lng: number }
    radius: number // in meters
    description: string
    color: string
}
export interface APIGetAllWorkareasRequest { token?: string }
export interface APIGetAllWorkareasResponse { success: boolean, employees?: CircularGeoFence[] }
export interface APIAddWorkareaRequest { token?: string, area?: CircularGeoFence }
export interface APIAddWorkareaResponse { success: boolean }
export interface APIDeleteWorkareaRequest { token?: string, areaId?: string }
export interface APIDeleteWorkareaResponse { success: boolean }

// ===  ===
export interface GeoFence {
    id: string // Uuid
    name: string
    description?: string
    coordinates: {
        latitude: number
        longitude: number
    }[]
    radius: number // in meters
}


export interface Account {
    id: string
    username: string
    password: string // In real app, this would be hashed
    role: "admin"
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

/*

session_id	user_id	work_area	start_time	end_time	total_work_duration	total_break_time	step_count	distance_traveled	sync_timestamp	device_info	weather_info	session_status

 */

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
