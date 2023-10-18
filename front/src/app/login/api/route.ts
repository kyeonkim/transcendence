import { NextRequest, NextResponse } from "next/server";

// 직렬화 주의
// NextResponse를 반환해야함.
// axios.post 대신, fetch 사용한 다음, 상태에 따라 동작 분화하는게 맞을 것 같음.

// NextRespons를 생성할 때, 해당 response의 쿠키를 설정하거나 반환할 redirect도 지정할 수 있음.

export async function POST (request: NextRequest)
{
    let response;
    let error_status;

    try
    {
        const   data = await request.json();

        console.log(data);
        console.log(data.access_token);
        console.log(data.nick_name);
        console.log(data.img_name);

        response = await fetch('http://10.13.9.2:4242/user/create', {
            method: "POST",
            body: JSON.stringify({
                access_token: data.access_token,
                nick_name: data.nick_name,
                img_name: data.img_name
            }),
        }).then((response) => response.json());

        // json화 쓰지 않고 사용해볼 수도 있음.
        if (!response.ok)
        {
            // error 발생한 경우
            error_status = response.status;
            throw new Error ("login/api - POST fetch error status");
        }
        console.log('login/api - response:', response.data);

        // created 201
    }
    catch (error)
    {
        return (NextResponse.json({ error: 'Internal Server Error'}, { status: error_status}));
    }
    // 성공 시 main_frame으로 이동. cookie는 어떻게하는게 맞을까? 일단 access_token, refresh_token 보관은 필요함.
    // 실패 시 실패를 알리기 위한 구조를 반환하고 동작 처리

    if (response.data.status == true)
    {
        console.log('status:', response.data.status);
    }
    return (NextResponse.json({ status: 200}));
}
