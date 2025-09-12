'use client'
import { Employee } from '@/lib/types';
import { useEffect, useState } from 'react';
import EmployeeManagementUI from './components/EmployeeManagementUI';

export default function EmployeeManagementLoaderClient() {
    const [employees, setEmployees] = useState<Employee[] | null>(null);

    useEffect(() => {
        fetch('/api/getAllEmployees', { method: 'POST', credentials: 'include' })
            .then(res => res.json())
            .then(data => setEmployees(data.employees));
    }, []);

    if (!employees) return <div>Loading...</div>;
    return <EmployeeManagementUI fetchedEmployees={employees} />;
}
