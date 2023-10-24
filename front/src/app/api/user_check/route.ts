import { NextRequest, NextResponse } from "next/server";

import { cookies } from 'next/headers';

import { permanentRedirect } from "next/navigation";

import axios from 'axios';

// 직렬화 주의
// NextResponse를 반환해야함.
// axios.post 대신, fetch 사용한 다음, 상태에 따라 동작 분화하는게 맞을 것 같음.

// NextRespons를 생성할 때, 해당 response의 쿠키를 설정하거나 반환할 redirect도 지정할 수 있음.

export async function POST (request: NextRequest)
{
    let response;
    let json_res;
    let data;
    let json_data;

    try
    {
        data = await request.json();

        console.log('api/user_check - data: ', data);

        response = await axios.post('http://10.13.9.4:4242/auth/login', {  
            access_token: data.access_token,
        });

        

    }
    catch (error)
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
                status: response?.status
            }))
        }
    }

    console.log('check for error position');
    console.log('check for response - ', response);
    console.log('check for response.data - ', response?.data)


    if (response?.data.status == false)
    {
        console.log('api/user_check failed');
        // 예외 처리
        return (NextResponse.json(
            {
                data: {
                    status: response?.data.status,
                    access_token: response?.data.access_token
                }
            },
            {status: 201, statusText: 'new user need to be created'}));
    }




    // if (response?.data.token.status == false)
    // {
    //     console.log('api/user_check failed');
    //     // 예외 처리
    //     return (NextResponse.json(
    //         {data: {
    //             status: response?.data.status,
    //             access_token: response?.data.access_token
    //         }},
    //         {status: 201, statusText: 'new user need to be created'}));
    // }

    // 성공 시 main_frame으로 이동. cookie는 어떻게하는게 맞을까? 일단 access_token, refresh_token 보관은 필요함.
    // 실패 시 실패를 알리기 위한 구조를 반환하고 동작 처리

    const newResponse = NextResponse.json(
        {
            data: {
            status: response?.data.token.status,
            access_token: response?.data.token.access_token,
            refresh_token: response?.data.token.refresh_token
        }},
        {
            status: 200,
            statusText: "will be redirected to main_frame",
        },
    );

    newResponse.cookies.set({
        name: 'access_token',
        value: response?.data.token.access_token,
        path: '/',
        maxAge: 60 * 3,
        // httpOnly: true
    });
    newResponse.cookies.set({
        name: 'refresh_token',
        value: response?.data.token.refresh_token,
        path: '/',
        maxAge: 60 * 3,
        // httpOnly: true
    });

    console.log(newResponse);

    // console.log('check for error position2');

    // if (response?.data.token.status == true)
    // {
    //     // 이번에는 토큰이 설정 안된 것 같다. 그 이유는 무엇일까?

    //     console.log('status:', response?.data.token.status);
    //     cookies().set('access_token', response?.data.token.access_token, {
    //         maxAge: 60 * 3,
    //         // httpOnly: true,
    //     });
    //     // console.log(cookies().get('access_token'));
    //     cookies().set('refresh_token', response?.data.token.refresh_token, {
    //         maxAge: 60 * 3,
    //         // httpOnly: true,
    //     });
    //     // permanentRedirect('/main_frame');
    //     // 왜 나중에 다시 login 쪽으로 돌아가는가?
    // }

    // if (response?.data.token.status == true)
    // {
    //     // 이번에는 토큰이 설정 안된 것 같다. 그 이유는 무엇일까?

    //     console.log('status:', response?.data.token.status);
    //     cookies().set('access_token', response?.data.token.access_token, {
    //         maxAge: 60 * 3,
    //         // httpOnly: true,
    //     });
    //     // console.log(cookies().get('access_token'));
    //     cookies().set('refresh_token', response?.data.token.refresh_token, {
    //         maxAge: 60 * 3,
    //         // httpOnly: true,
    //     });
    //     // permanentRedirect('/main_frame');
    //     // 왜 나중에 다시 login 쪽으로 돌아가는가?
    // }

    return (newResponse);
    // return (NextResponse.json({
    //     status: response?.data.token.status,
    //     access_token: response?.data.token.access_token,
    //     refresh_token: response?.data.token.refresh_token
    // }));
}
