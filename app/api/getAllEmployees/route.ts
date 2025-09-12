import { NextRequest, NextResponse } from "next/server"
import { APIGetAllEmployeesRequest, APIGetAllEmployeesResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (token === undefined) return NextResponse.json({ success: false }, { status: 500 });

    const query: string = "?action=getAllEmployees";
    const gasUrl = process.env.GAS_URL;
    const reqBody: APIGetAllEmployeesRequest = { token: token };
    let resGAS: Response;
    try {
        resGAS = await fetch(gasUrl + query as string, {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }, // ブラウザから送るわけではないのでCORS対策は必要ない
            body: JSON.stringify(reqBody),
        });
    } catch (err) {
        return NextResponse.json({ success: false }, { status: 501 })
    }

    let data: APIGetAllEmployeesResponse
    try {
        data = await resGAS.json()
    } catch (err) {
        return NextResponse.json({ success: false }, { status: 502 })
    }
    const isSuccess = data.success;
    if (!isSuccess) return NextResponse.json({ success: false }, { status: 400 })

    return NextResponse.json(data);
}
