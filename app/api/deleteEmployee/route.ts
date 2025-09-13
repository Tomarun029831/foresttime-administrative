import { NextRequest, NextResponse } from "next/server"
import { APIAddEmployeeResponse, APIDeleteEmployeeRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (token === undefined) return NextResponse.json({ success: false }, { status: 500 });
    const body = await req.json() as APIDeleteEmployeeRequest;
    const employeeId = body.employeeId;
    if (employeeId === undefined) return NextResponse.json({ success: false }, { status: 504 });

    const query: string = "?action=deleteEmployee";
    const gasUrl = process.env.GAS_URL;
    const reqBody: APIDeleteEmployeeRequest = { token: token, employeeId: employeeId };
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

    let data: APIAddEmployeeResponse
    try {
        data = await resGAS.json()
    } catch (err) {
        return NextResponse.json({ success: false }, { status: 502 })
    }
    const isSuccess = data.success;
    if (!isSuccess) return NextResponse.json({ success: false }, { status: 400 })

    return NextResponse.json(data);
}
