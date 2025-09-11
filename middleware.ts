import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

interface APICheckTokenResponse { success: boolean }

const protectedPaths = ['/admin']

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.redirect(new URL('/', req.url))

    if (protectedPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
        const query = "?action=checkToken"
        const res = await fetch(`${process.env.GAS_URL}${query}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
        const data: APICheckTokenResponse = await res.json()

        if (!data.success) return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
