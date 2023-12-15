
import axios from 'axios';
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { permanentRedirect } from "next/navigation";

export async function POST (request: NextRequest)
{
    let response;
    let error_status;

    try
    {
        const   data = await request.json();
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/create`, {
            access_token: data.access_token,
            nick_name: data.nick_name,
            img_name: data.img_name
        });
    }
    catch (error)
    {
        return (NextResponse.json({ error: 'login/api Error'}, { status: error_status}));
    }

    if (response.data.token.status == true)
    {
        cookies().set('access_token', response.data.token.access_token, {
            maxAge: 60 * 3,
            // httpOnly: true,
        });
        cookies().set('refresh_token', response.data.token.refresh_token, {
            maxAge: 60 * 3,
            // httpOnly: true,
        });
        // permanentRedirect('/main_frame');
        // 왜 나중에 다시 login 쪽으로 돌아가는가?
    }
    return (NextResponse.redirect("/main_frame"));
}
