import { NextRequest, NextResponse } from "next/server";


import { cookies } from 'next/headers';

export async function POST (request: NextRequest)
{
    let data = await request.json();
    let access_token = data.access_token;
    let refresh_token = data.refresh_token;
    let nick_name = data.nick_name;
    let user_id = data.user_id;


    if (access_token != undefined && refresh_token != undefined
        && access_token != null && refresh_token != null)
    {
        const cookieBox = cookies();
        cookieBox.set('access_token', access_token, {
            path: '/',
            maxAge: 600 * 60 * 3,
            // httpOnly: true,
        });
        cookieBox.set('refresh_token', refresh_token, {
            path: '/',
            maxAge: 600 * 60 * 3,
            // httpOnly: true,
        });
        if (nick_name && user_id) {
            cookieBox.set('nick_name', nick_name, {
                path: '/',
                maxAge: 600 * 60 * 3,
                // httpOnly: true,
            });
            cookieBox.set('user_id', user_id, {
                path: '/',
                maxAge: 600 * 60 * 3,
                // httpOnly: true,
            });
        }

        return (NextResponse.json(
            {
                success: true
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
