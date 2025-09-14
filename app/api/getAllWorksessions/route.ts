import { NextRequest, NextResponse } from "next/server"
import { APIGetAllWorkareasResponse, APIGetAllWorksessionsRequest, APIGetAllWorksessionsResponse, WorkingSession } from "@/lib/types";

export async function POST(req: NextRequest) {
    // const token = req.cookies.get("token")?.value;
    // if (token === undefined) return NextResponse.json({ success: false }, { status: 500 });
    //
    // const query: string = "?action=getAllWorksessions";
    // const gasUrl = process.env.TAMASAN_GAS_URL;
    // const reqBody: APIGetAllWorksessionsRequest = {};
    // let resGAS: Response;
    // try {
    //     resGAS = await fetch(gasUrl + query as string, {
    //         method: 'GET',
    //         cache: 'no-store',
    //         headers: { 'Content-Type': 'application/json' }, // ブラウザから送るわけではないのでCORS対策は必要ない
    //     });
    //     console.log(resGAS)
    // } catch (err) {
    //     return NextResponse.json({ success: false }, { status: 501 })
    // }
    //
    // let data: APIGetAllWorkareasResponse
    // try {
    //     data = await resGAS.json()
    // } catch (err) {
    //     return NextResponse.json({ success: false }, { status: 502 })
    // }
    // console.log(data);
    // const isSuccess = data.success;
    // if (!isSuccess) return NextResponse.json({ success: false }, { status: 400 })

    // return NextResponse.json(data);

    const mock_data: APIGetAllWorksessionsResponse =
    {
        success: true,
        workingSessions: [
            {
                session_id: '9CCCFC7E-F2F2-4F20-96D4-A41703A37B35',
                user_id: 'user_A059EE9D-976A-4757-9B9F-5BA7F8989718',
                work_area: '富士吉田市',
                start_time: '2025/09/14 1:34:30',
                end_time: '2025/09/14 1:34:30',
                total_work_duration: '27.00095201',
                total_break_time: '2.932932019',
                step_count: 0,
                distance_traveled: '0',
                sync_timestamp: '2025/09/14 1:34:30',
                device_info: 'iOS 18.5',
                weather_info: '曇のち時々晴 34°C',
                session_status: 'completed',
            },
            {
                session_id: '81FA87E6-98D1-48BD-877F-9CE417E0F9FF',
                user_id: 'user_A059EE9D-976A-4757-9B9F-5BA7F8989718',
                work_area: '富士吉田市',
                start_time: '2025/09/14 1:39:49',
                end_time: '2025/09/14 1:40:14',
                total_work_duration: '20.00109601',
                total_break_time: '3.412246943',
                step_count: 0,
                distance_traveled: '0',
                sync_timestamp: '2025/09/14 1:40:14',
                device_info: 'iOS 18.5',
                weather_info: '曇のち時々晴 34°C',
                session_status: 'completed',
            },
            {
                session_id: '6FDB17F9-B2A1-428A-98C1-C7F25977F196',
                user_id: 'user_A059EE9D-976A-4757-9B9F-5BA7F8989718',
                work_area: '富士吉田市',
                start_time: '2025/09/14 1:52:01',
                end_time: '2025/09/14 1:53:01',
                total_work_duration: '14.83532703',
                total_break_time: '4.115494967',
                step_count: 0,
                distance_traveled: '0',
                sync_timestamp: '2025/09/14 1:53:01',
                device_info: 'iOS 18.5',
                weather_info: '曇のち時々晴 34°C',
                session_status: 'completed',
            },
            {
                session_id: '19958CEA-58A8-44ED-A913-131358985797',
                user_id: 'user_A059EE9D-976A-4757-9B9F-5BA7F8989718',
                work_area: '富士吉田市',
                start_time: '2025/09/14 2:37:30',
                end_time: '2025/09/14 2:37:48',
                total_work_duration: '14.16422307',
                total_break_time: '3.736560941',
                step_count: 0,
                distance_traveled: '0',
                sync_timestamp: '2025/09/14 2:37:48',
                device_info: 'iOS 18.5',
                weather_info: '曇のち時々晴 34°C',
                session_status: 'completed',
            },
        ]
    }

    return NextResponse.json(mock_data);
}
