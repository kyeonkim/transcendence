import { NextRequest, NextResponse } from "next/server";


import { cookies } from 'next/headers';

export async function GET (request: NextRequest)
{
    // let data = await request.json();
    const cookieBox = cookies();
    const access_token = cookieBox.get('access_token');
    const refresh_token = cookieBox.get('refresh_token');
    const nick_name = cookieBox.get('nick_name');
    const user_id = cookieBox.get('user_id');
    
    // 조건 추가 고려
        // data에서 참조하여 판단
    if (user_id && nick_name && access_token && refresh_token) {
        return (NextResponse.json(
            {
                success: true,
                user_id: user_id,
                nick_name: nick_name,
                access_token: access_token,
                refresh_token: refresh_token
            },
            {
                status: 200
            }
            )
        );
    }
    return (NextResponse.json(
        {
            success: false
        },
        {
            status: 500
        }
    ));
}
