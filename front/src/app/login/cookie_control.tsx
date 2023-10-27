'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import axios from 'axios';


export default function CookieControl (props:any) {

    const router = useRouter();

    const access_token = props.access_token;
    const refresh_token = props.refresh_token;
    const nick_name = props.nick_name;
    const user_id = props.user_id;
    let   response_error = false;

    console.log("access_token -", access_token);
    console.log("refresh_token -", refresh_token);
    console.log("nick_name -", nick_name);
    console.log("user_id -", user_id); 

    async function CookieSetter (access_token:any, refresh_token:any, nick_name:any, user_id:any)
    {
        try
        {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/set_cookie`, {
                access_token: access_token,
                refresh_token: refresh_token,
                nick_name: nick_name,
                user_id: user_id
            });
        
            console.log('cookie_control - respone - ', response.data);
            return (response);
        }
        catch
        {
            throw new Error ('Cookie set fail');
        }
    }

    useEffect(() => {
        
        try
        {
            const response = CookieSetter(access_token, refresh_token, nick_name, user_id);

            console.log('cookie set done');

            
            router.replace('/main_frame');

        }
        catch (error)
        {
            console.log('/login/cookie_control - fail to set cookie');
            response_error = true;
            router.replace("/entrance");
        }

    }, []);

    console.log('in useEffect');

    return (
        <div>
            <div>Cookie Control</div>
        </div>
      );
}
