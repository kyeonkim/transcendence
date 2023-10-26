'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import axios from 'axios';


export default function CookieControl (props:any) {

    const router = useRouter();

    const access_token = props.access_token;
    const refresh_token = props.refresh_token;
    let   response_error = false;

    console.log("access_token -", access_token);
    console.log("refresh_token -", refresh_token);

    async function CookieSetter (access_token:any, refresh_token:any)
    {
        try
        {
            const response = await axios.post('http://10.13.8.1:3000/api/set_cookie', {
                access_token: access_token,
                refresh_token: refresh_token
            });
        
            console.log('cookie_control - respone - ', response.data);
            return (response);
        }
        catch
        {
            throw new Error ('Cookie set fail');
        }
    }

    // client hydration 전에 router.replace를 시도하게 만들어서 server에는 location이 없으므로 에러가 발생할 가능성이 보였다.
    // client side에서 동작핟도록 useEffect를 사용하면 어떨까 싶다.

    useEffect(() => {
        
        try
        {
            const response = CookieSetter(access_token, refresh_token);

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



// server side에서 router.replace 수행하는 것으로 의심되어 위치를 바꾸기로 함.

// export default function CookieControl (props:any) {

//     const router = useRouter();

//     const access_token = props.access_token;
//     const refresh_token = props.refresh_token;

//     console.log("access_token -", access_token);
//     console.log("refresh_token -", refresh_token);


//     async function CookieSetter (access_token:any, refresh_token:any)
//     {
//         try
//         {
//             const response = await axios.post('http://10.13.8.1:3000/api/set_cookie', {
//                 access_token: access_token,
//                 refresh_token: refresh_token
//             });
        
//             console.log('cookie_control - respone - ', response.data);
//             return (response);
//         }
//         catch
//         {
//             throw new Error ('Cookie set fail');
//         }
//     }

//     // client hydration 전에 router.replace를 시도하게 만들어서 server에는 location이 없으므로 에러가 발생할 가능성이 보였다.
//     // client side에서 동작핟도록 useEffect를 사용하면 어떨까 싶다.

//     return (
//         <div>
//           {(async () => {
//             try
//             {
//                 const response = await CookieSetter(access_token, refresh_token);
  
//                 console.log('cookie set done');

//                 router.replace("/main_frame");
  
//                 return (
//                     <div>
//                         Cookie Setter
//                     </div>
//                 );
//             }
//             catch (error)
//             {
//                 console.log('/login/cookie_control - fail to set cookie');
//                 router.replace("/entrance");
//             }
//             })()};
//         </div>
//       );
// }
