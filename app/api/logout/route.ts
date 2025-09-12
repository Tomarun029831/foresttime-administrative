import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    })
    return response
}
