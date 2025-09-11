import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

interface APICheckTokenResponse { success: boolean }

const directoryToSeekToken: string[] = ['/admin'];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (token === undefined || directoryToSeekToken.some(s => req.nextUrl.pathname.startsWith(s)))
        return NextResponse.redirect(new URL('/', req.url));

    const query: string = "?action=checkToken"; // HACK:
    const res = await fetch(process.env.GAS_URL + query as string, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ブラウザから送るわけではないのでCORS対策は必要ない
        body: JSON.stringify({ 'token': token })
    });
    const data: APICheckTokenResponse = await res.json();

    if (data.success)
        return NextResponse.next();

    return NextResponse.redirect(new URL('/', req.url));
}

export const config = {
    matcher: ['/admin/:path*'],
}
