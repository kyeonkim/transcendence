import { NextRequest, NextResponse } from "next/server";

import { permanentRedirect } from "next/navigation";

import axios from 'axios';

// 직렬화 주의
// NextResponse를 반환해야함.
// axios.post 대신, fetch 사용한 다음, 상태에 따라 동작 분화하는게 맞을 것 같음.

// NextRespons를 생성할 때, 해당 response의 쿠키를 설정하거나 반환할 redirect도 지정할 수 있음.


const getCorsHeaders = (origin: string) => {
    // Default options
    const headers = {
      "Access-Control-Allow-Methods": `GET, POST, PUT, DELETE, OPTIONS`,
      "Access-Control-Allow-Headers": `Content-Type, Authorization`,
      "Access-Control-Allow-Origin": `${process.env.NEXT_PUBLIC_GABIA_URL}`,
    };
  
    // If no allowed origin is set to default server origin
    if (!process.env.ALLOWED_ORIGIN || !origin) return headers;
  
    // If allowed origin is set, check if origin is in allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGIN.split(",");
  
    // Validate server origin
    if (allowedOrigins.includes("*")) {
      headers["Access-Control-Allow-Origin"] = "*";
    } else if (allowedOrigins.includes(origin)) {
      headers["Access-Control-Allow-Origin"] = origin;
    }
  
    // Return result
    return headers;
  };

export const OPTIONS = async (request: NextRequest) => {
    // Return Response
    return NextResponse.json(
        {},
        {
        status: 200,
        headers: getCorsHeaders(request.headers.get("origin") || ""),
        }
    );
};

export async function POST (request: NextRequest)
{
    let response;
    let json_res;
    let data;
    let json_data;

    try
    {
        data = await request.json();

        response = await axios.post( `${process.env.NEXT_PUBLIC_API_DIRECT_URL}auth/login`, {  
            access_token: data.access_token,
        });

    }
    catch (error: any)
    {
        if (error.response)
        {
            return (NextResponse.json({
                error: 'user_check response error',
                error_status: response?.status,
                status: data.status,
                access_token: data.access_token
            }))
        }
        else if (error.request)
        {
            return (NextResponse.json({
                error: 'user_check request error'
            },{
                status: response?.status,
                headers: getCorsHeaders(request.headers.get("origin") || ""),
            }))
        }
    }

    if (response?.data.status == false)
    {
        // 예외 처리
        return (NextResponse.json(
            {
                status: response?.data.status,
                access_token: response?.data.access_token
            },
            {
                status: 201,
                statusText: 'new user need to be created',
                headers: getCorsHeaders(request.headers.get("origin") || ""),
            }));
    }
    
    const newResponse = NextResponse.json(
        {
            status: response?.data.token.status,
            twoFAPass: response?.data.twoFAPass,
            access_token: response?.data.token.access_token,
            refresh_token: response?.data.token.refresh_token,
            nick_name: response?.data.userdata.nick_name,
            user_id: response?.data.userdata.user_id

        },
        {
            status: 200,
            statusText: "will be redirected to main_frame",
            headers: getCorsHeaders(request.headers.get("origin") || ""),
            //headers:
        },
    );



    return (newResponse);

}
