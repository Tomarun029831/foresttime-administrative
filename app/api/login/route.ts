import { NextResponse } from "next/server"
import { APILoginRequest, APILoginResponse } from "@/lib/types";

export async function POST(req: Request) {
    const { username, password } = await req.json() as APILoginRequest

    const query: string = "?action=login"; // HACK:
    const gasUrl = process.env.GAS_URL
    const resGAS = await fetch(gasUrl + query as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ブラウザから送るわけではないのでCORS対策は必要ない
        body: JSON.stringify({ username, password }),
    })
    const data = await resGAS.json() as APILoginResponse
    const isSuccess = data.success;
    if (!isSuccess) return NextResponse.json({ success: false }, { status: 401 })
    const token = data.token;
    if (token === undefined) return NextResponse.json({ success: false }, { status: 401 });

    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // HACK: one Day
    })

    return response
}
