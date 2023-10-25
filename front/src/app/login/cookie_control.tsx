'use client'

import { useRouter } from 'next/navigation';

import Link from 'next/link'
import axios from 'axios';

export default async function CookieControl (props:any) {
    const router = useRouter();

    const access_token = props.access_token;
    const refresh_token = props.refresh_token;

    console.log("access_token -", access_token);
    console.log("refresh_token -", refresh_token);


    
    try
    {
        const response = await axios.post('http://10.13.8.1:3000/api/set_cookie', {
            access_token: access_token,
            refresh_token: refresh_token
        });
    
        console.log('cookie_control - respone - ', response);
    }
    catch
    {

    }

    router.replace("/main_frame");

    return (
        <div>
            <p>cookie control</p>
        </div>

        // <Link href="/main_frame"> to main_frame </Link>
    );
}
