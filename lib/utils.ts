import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export async function serverFetch(input: string, init?: RequestInit): Promise<Response> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
    return fetch(`${baseUrl}${input}`, init);
}

export function timeFormatJPHM(time: Date): string {
    return new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(time)
}
