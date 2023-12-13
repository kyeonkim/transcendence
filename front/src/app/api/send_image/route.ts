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
        console.log('==========================In send_img try==========================')

        console.log ('setdata: ', request);

        const formData = await request.formData()
        console.log ('setdata - request.formData - ', formData);
        const name = formData.get('nick_name');
        const file = formData.get('file');
        const cookieBox = cookies();
        console.log ('name - ', name);
        console.log ('file - ', file);

        console.log('----------check for formdata dereference---------');

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

        console.log('api/load - ', response);
        // response = response.json();
    }
    catch (error)
    {
        console.log('==========================In send_img catch error==========================')
        if (error.response)
        {
            // console.log('error.response - ', error.response);
            
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
            console.log('error.request - ', error.request, `${process.env.NEXT_PUBLIC_API_URL}user/upload`);

            return (NextResponse.json({
                error: 'user_check request error',
                success: false
            },{
                status: error.response?.status
            }))
        }
        console.log('----');
    }

    console.log('in api/send_image - ', response);

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