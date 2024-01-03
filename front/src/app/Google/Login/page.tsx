import React from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';

import Signup from './signup';
import CookieControl from './cookie_control';
import TwoFAPass from './twoFAPass';


export default function GLogin ({searchParams}:any) {

  const code = searchParams.code;
  
  console.log('searchParams - ', searchParams);

  let responseData;
  let cookie_control = false;

  // console.log('in GLogin - ', code);

  async function AuthG (code :any) {

      let responseDatabase;

      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/googlelogin`, {
          code: code
        })
        
        // 백에서 코드를 가지고 토큰까지 받아준다? 
        // responseDatabase = await CheckUserInDatabase(res.data);
        
        // console.log('Glogin res data ', res);
        responseDatabase = res;

         
        // console.log('in 424242424242424',responseDatabase);
        
      } catch(err: any){
        // console.log('in 4242442errrrrrrrrrrrrr', err);
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

  
  // async function CheckUserInDatabase (data:any)
  // {
  //   let code;
  //   let status;
  //   let userData;

  //   try
  //   {
  //     userData = await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/user_check`, {
  //       code: data.access_token
  //     });

  //     code = userData.data.access_token;
  //     status = userData.data.status;

  //     if (access_token == undefined
  //       || code == null)
  //       {
  //         throw new Error ('to entrance');
  //       }

  //   }
  //   catch (error)
  //   {
  //       // async 안에서 redirect 하지 말아야하나?
  //       redirect('/');
  //   }

  //   return (userData);
  // }

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
          if(responseData == undefined)
          {
            redirect ('/');
          }
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
                <Signup code={responseData?.access_token} />
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