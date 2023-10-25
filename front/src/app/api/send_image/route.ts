import { NextRequest, NextResponse } from "next/server";


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
        const name = formData.get('file');

        console.log ('name - ', name);

        // for (let key of request.body.keys()) {
        //     console.log(key);
        //   }  
      
        //   for (let value of request.body.values()) {
        //   console.log(value);
        //   }

        console.log('----------check for formdata dereference---------');

        // data = await request.json();

        // response = await fetch('http://10.13.9.4:4242/user/upload', {
        //     method: "POST",
        //     body: data.Formdata,
        //   })

        response = await axios.post('http://10.13.9.4:4242/user/upload',
                formData,
                {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                }});

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
            // console.log('error.request - ', error.request);

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

    return (NextResponse.json({
        status: response?.status, success: true
    }));
}
