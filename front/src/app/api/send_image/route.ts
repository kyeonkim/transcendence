import axios from 'axios';
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function POST (request: NextRequest)
{
    let response;
    try
    {

        const formData = await request.formData()

        const name = formData.get('nick_name');

        response = await axios.post( `${process.env.NEXT_PUBLIC_API_DIRECT_URL}user/upload`,
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
    }
    catch (error: any)
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
