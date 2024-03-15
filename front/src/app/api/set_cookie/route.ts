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


export async function POST(request: Request){
    let data = await request.json();
    let access_token = data.access_token;
    let refresh_token = data.refresh_token;
    let nick_name = data.nick_name;
    let user_id = data.user_id;

    const corsHeaders = {
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }

    if (access_token != undefined && refresh_token != undefined
        && access_token != null && refresh_token != null)
    {
        const cookieBox = cookies();
        cookieBox.set('access_token', access_token, {
            path: '/',
            maxAge: 600 * 60 * 3,

        });
        cookieBox.set('refresh_token', refresh_token, {
            path: '/',
            maxAge: 600 * 60 * 3,

        });
        if (nick_name && user_id) {
            cookieBox.set('nick_name', nick_name, {
                path: '/',
                maxAge: 600 * 60 * 3,

            });
            cookieBox.set('user_id', user_id, {
                path: '/',
                maxAge: 600 * 60 * 3,

            });
        }

        return (NextResponse.json(
            {
                success: true
            },
            {
                status: 200,
                headers: getCorsHeaders(request.headers.get("origin") || ""),
            }
            )
        );
    }
    return (NextResponse.json(
        {
            success: false
        },
        {
            status: 500,
            headers: getCorsHeaders(request.headers.get("origin") || ""),
        }
    ));
}
