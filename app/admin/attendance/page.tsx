'use client'
import { APIGetAllWorksessionsResponse, CircularGeoFence, Employee } from '@/lib/types';
import { useEffect, useState } from 'react';
import { WorkingSession, APIGetAllWorkareasResponse, APIGetAllEmployeesResponse } from '@/lib/types';
import AttendanceMonitoringUI from './components/AttendanceMonitoringUI';

export default function EmployeeManagementLoaderClient() {
    const [sessions, setSessions] = useState<WorkingSession[] | null>(null);
    const [employees, setEmployees] = useState<Employee[] | null>(null);
    const [areas, setAreas] = useState<CircularGeoFence[] | null>(null);

    useEffect(() => {
        fetch('/api/getAllAreas', { method: 'POST', credentials: 'include' })
            .then(res => res.json())
            .then(data => setAreas(data.areas));
        fetch('/api/getAllEmployees', { method: 'POST', credentials: 'include' })
            .then<APIGetAllEmployeesResponse>(res => res.json())
            .then(data => setEmployees(data.success ? data.employees as Employee[] : null));
        fetch('/api/getAllWorksessions', { method: 'POST', credentials: 'include' })
            .then<APIGetAllWorksessionsResponse>(res => res.json())
            .then(data => setSessions(data.success ? data.workingSessions as WorkingSession[] : null));
    }, []);

    if (!sessions || !employees || !areas) return <div>Loading...</div>;
    return <AttendanceMonitoringUI fetchedworkingsessions={sessions} employees={employees} fetchedareas={areas} />;
}
