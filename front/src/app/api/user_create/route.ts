import { NextRequest, NextResponse } from "next/server";

import { cookies } from 'next/headers';

import { permanentRedirect } from "next/navigation";

import axios from 'axios';


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
    let error_status;

    try
    {
        const   data = await request.json();

        response = await axios.post(process.env.NEXT_PUBLIC_API_DIRECT_URL + 'auth/signup', {
            access_token: data.access_token,
            nick_name: data.nick_name,
            // img_name: data.img_name
        });

    }
    catch (err: any)
    {
        error_status = err?.response.data.status;

        return (NextResponse.json({ error: 'api/user_create Error'}, { status: error_status}));
        // return;
    }
    if (response.data.status == true && response.data.token.status == true)
    {
        const cookieBox = cookies();

        cookieBox.set('access_token', response.data.token.access_token, {
            path: '/',
            maxAge: 60 * 60 * 3,
            // httpOnly: true,
        });
        cookieBox.set('refresh_token', response.data.token.refresh_token, {
            path: '/',
            maxAge: 60 * 60 * 3,
            // httpOnly: true,
        });
        cookieBox.set('nick_name', response.data.userdata.nick_name, {
            path: '/',
            maxAge: 60 * 60 *3,
            // httpOnly: true,
        });
        cookieBox.set('user_id', response.data.userdata.user_id, {
            path: '/',
            maxAge: 60 * 60 * 3,
            // httpOnly: true,
        });
    }
    else {
        return (NextResponse.json({
            status: false,
            message: response.data.message,
        },
        {
            status: 201,
            headers: getCorsHeaders(request.headers.get("origin") || ""),
        }
        ));
    }

    return (NextResponse.json({
        status: response.data.token.status,
        access_token: response.data.token.access_token,
        refresh_token: response.data.token.refresh_token
    },
    {
        status: response.status,
        headers: getCorsHeaders(request.headers.get("origin") || ""),
    }
    ));
}
