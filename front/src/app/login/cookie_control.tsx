'use client'

import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

import { redirect } from 'next/navigation';

export default function CookieControl (props:any) {

    const router = useRouter();

    const access_token = props.access_token;
    const refresh_token = props.refresh_token;

    setCookie("access_token", access_token, {httpOnly:true, maxAge: 60 * 3});
    setCookie("refresh_token", refresh_token, {httpOnly:true, maxAge: 60 * 3});

    router.replace("/main_frame"); 
    
    // redirect("/main_frame");

    return (
        <div>
            Cookie Setting
        </div>
    );
}
