import axios from 'axios';
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';


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
                status:error.response.status,
                headers: getCorsHeaders(request.headers.get("origin") || ""),
            }))
        }
        else if (error.request)
        {

            return (NextResponse.json({
                error: 'user_check request error',
                success: false
            },{
                status: error.response?.status,
                headers: getCorsHeaders(request.headers.get("origin") || ""),
            }))
        }

    }
    return (NextResponse.json(
        {
            success: true
        },
        {
            status: response?.status,
            headers: getCorsHeaders(request.headers.get("origin") || ""),
        }
        )
    );
}
