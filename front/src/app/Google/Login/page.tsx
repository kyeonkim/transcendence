import React from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';

import Signup from './signup';
import CookieControl from './cookie_control';
import TwoFAPass from './twoFAPass';


export default function GLogin ({searchParams}:any) {

  const code = searchParams.code;

  let responseData;
  let cookie_control = false;

  // console.log('in GLogin - ', code);

  async function AuthG (code :any) {

      let responseDatabase;
      
      console.log('AuthG called');
      const res = await axios.post('https://oauth2.googleapis.com/token', {},
      {
        params : {         
          code: code,
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
          client_secret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
          grant_type: 'authorization_code',
        }
      }
      )
      .then(async (res: any) => {
        // console.log('google access token =============== \n', res);
        responseDatabase = await CheckUserInDatabase(res.data);
      })
      .catch((err: any) => {
        console.log('in err===',res);
        if (err.response)
        {
          return (err.response);
        }
        else if (err.request)
        {
          return (err.request);
        }
      })

      return (responseDatabase);
  };

  
  async function CheckUserInDatabase (data:any)
  {
    let access_token;
    let status;
    let userData;
    let newResponse;

    try
    {
      userData = await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/google_user_check`, {
        access_token: data.access_token
      });

      // userData = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/googlelogin`, {
      //   access_token: data.access_token
      // })

      // console.log('CheckUserInDatabase =======', userData);
      
      access_token = userData.data.access_token;
      status = userData.data.status;


      if (access_token === undefined
        || access_token === null)
        {
          throw new Error ('to entrance');
        }

    }
    catch (error)
    {
        redirect('/');
    }

    return (userData);
  }

  if (true || code)
  {
    return (
      <>
      {(async () => {
        try
        {
          const response: any = await AuthG(code);

          responseData = response?.data;
          console.log(responseData);
          if(responseData === undefined)
          {
            redirect ('/');
          }
          if (responseData?.refresh_token !== undefined
            && responseData?.refresh_token !== null)
          {
              if (responseData?.twoFAPass === false)
              {
                return (
                  <div>
                    <TwoFAPass res={responseData}/>
                  </div>
                )
              }
              cookie_control = true;
          }
  
          if (cookie_control == true)
          {
            return (
                <div>
                    <CookieControl res={responseData} />
                </div>
            );
          }
          else
          {
            return (
                <Signup access_token={responseData?.access_token} />
            );
  
          }
        }
        catch
        {
          redirect ('/');
        }
        })()}
      </>   
    );
  }
  else
  {
    redirect ('/');
  }
}