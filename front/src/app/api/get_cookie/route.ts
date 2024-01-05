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

export async function GET (request: NextRequest)
{
    // let data = await request.json();
    const cookieBox = cookies();
    const access_token = cookieBox.get('access_token');
    const refresh_token = cookieBox.get('refresh_token');
    const nick_name = cookieBox.get('nick_name');
    const user_id = cookieBox.get('user_id');
    
    // console.log('get cookie called',{
    //     success: true,
    //     user_id: user_id,
    //     nick_name: nick_name,
    //     access_token: access_token,
    //     refresh_token: refresh_token
    // });
    // 조건 추가 고려
        // data에서 참조하여 판단
    if (user_id && nick_name && access_token && refresh_token) {
        return (NextResponse.json(
            {
                success: true,
                user_id: user_id,
                nick_name: nick_name,
                access_token: access_token,
                refresh_token: refresh_token
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
// import { NextRequest, NextResponse } from "next/server";
// import cors from 'cors';

// export async function GET(request: NextRequest) {
//   const corsMiddleware = cors();

//   return new Promise((resolve, reject) => {
//     corsMiddleware(request.nextRequest, request.nextResponse, (error) => {
//       if (error) {
//         return reject(error);
//       }

//       const cookieBox = cookies();
//       const access_token = cookieBox.get('access_token');
//       const refresh_token = cookieBox.get('refresh_token');
//       const nick_name = cookieBox.get('nick_name');
//       const user_id = cookieBox.get('user_id');

//       if (user_id && nick_name && access_token && refresh_token) {
//         return resolve(
//           NextResponse.json({
//             success: true,
//             user_id: user_id,
//             nick_name: nick_name,
//             access_token: access_token,
//             refresh_token: refresh_token
//           }, {
//             status: 200
//           })
//         );
//       }

//       return resolve(
//         NextResponse.json({
//           success: false
//         }, {
//           status: 500
//         })
//       );
//     });
//   });
// }
