import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

import axios from 'axios';
import { headers } from "next/headers";

export async function POST (request: NextRequest)
{
    let response;
    let data;
    try
    {

        const formData = await request.formData()

        const name = formData.get('nick_name');
        const file = formData.get('file');
        const cookieBox = cookies();

        response = await axios.post( `${process.env.NEXT_PUBLIC_API_URL}user/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${formData.get('access_token')}`
                    },
                    params: {
                        nickname: name
                    }
                });


        // response = response.json();
    }
    catch (error)
    {

        if (error.response)
        {
            return (NextResponse.json({
                error: 'user_check response error',
                error_status: response?.status,
                success: false
            },
            {
                status:error.response.status
            }))
        }
        else if (error.request)
        {

            return (NextResponse.json({
                error: 'user_check request error',
                success: false
            },{
                status: error.response?.status
            }))
        }

    }


    return (NextResponse.json(
        {
            success: true
        },
        {
            status: response?.status
        }
        )
    );
}
