import { NextRequest, NextResponse } from "next/server";

import { cookies } from 'next/headers';


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
    }
    return NextResponse.json({status:200}, {headers: corsHeaders});
}


//Add and setting up the OPTIONS method
export async function OPTIONS(request: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true'
  }
  return new Response(null, {
    status: 204,
    headers:corsHeaders
  });
}
