'use client'
import { CircularGeoFence } from '@/lib/types';
import { useEffect, useState } from 'react';
import WorkareaManagementUI from './components/WorkareaManagementUI';

export default function EmployeeManagementLoaderClient() {
    const [areas, setAreas] = useState<CircularGeoFence[] | null>(null);

    useEffect(() => {
        fetch('/api/getAllAreas', { method: 'POST', credentials: 'include' })
            .then(res => res.json())
            .then(data => setAreas(data.areas));
    }, []);

    if (!areas) return <div>Loading...</div>;
    return <WorkareaManagementUI fetchedAreas={areas} />;
}
