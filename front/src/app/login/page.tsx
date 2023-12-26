
import React from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';

import Signup from './signup';
import CookieControl from './cookie_control';
import TwoFAPass from './twoFAPass';


export default function Login ({searchParams}:any) {

  const code = searchParams.code;

  let responseData;
  let cookie_control = false;

  async function Auth42 (code:any) {

      let responseDatabase;

      try {

        const res = await axios.post('https://api.intra.42.fr/oauth/token', {
          code: code,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          redirect_uri: `${process.env.NEXT_PUBLIC_FRONT_URL}login`,
          grant_type: 'authorization_code'
        })
        
        responseDatabase = await CheckUserInDatabase(res.data);
      } catch(err: any){
        if (err.response)
        {
          return (err.response);
        }
        else if (err.request)
        {
          return (err.request);
        }
      };

      return (responseDatabase);
  };

  
  async function CheckUserInDatabase (data:any)
  {
    let access_token;
    let status;
    let userData;

    try
    {
      userData = await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/user_check`, {
        access_token: data.access_token
      });

      access_token = userData.data.access_token;
      status = userData.data.status;

      if (access_token == undefined
        || access_token == null)
        {
          throw new Error ('to entrance');
        }

    }
    catch (error)
    {
        // async 안에서 redirect 하지 말아야하나?
        redirect('/');
    }

    return (userData);
  }

  if (code)
  {
    return (
      <>
      {(async () => {
        try
        {
          const response: any = await Auth42(code);

          responseData = response?.data;

          if(responseData == undefined)
            redirect ('/');
          if (responseData?.refresh_token != undefined
            && responseData?.refresh_token != null)
          {
              if (responseData?.twoFAPass == false)
              {
                return (
                <div>
                  <TwoFAPass res={responseData}/>
                </div>
                )
                // 자식 클라이언트 컴포넌트에서 6자리 숫자를 인풋받고 여기로 가져와서 2차인증 api 진행 후 cookie 생성
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