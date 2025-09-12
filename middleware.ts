import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { APITokenCheckRequest, APITokenCheckResponse } from "./lib/types";


export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(new URL('/', req.url))
    const apiReq: APITokenCheckRequest = { token: token };

    const query = "?action=checkToken"
    const res = await fetch(`${process.env.GAS_URL}${query}`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiReq)
    })
    const data: APITokenCheckResponse = await res.json()
    if (!data.success) return NextResponse.redirect(new URL('/', req.url))

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
