
import React from 'react';
import { redirect } from 'next/navigation';
import axios from 'axios';

import Signup from './signup';
import CookieControl from './cookie_control';



export default function Login ({searchParams}:any) {

  console.log('---------------------------------------------------');
  console.log('------------------ /login starts ------------------');
  console.log('---------------------------------------------------');

  console.log('code:', searchParams.code);

  const code = searchParams.code;

  let responseData;
  let cookie_control = false;

  async function Auth42 (code:any) {

      let response;
      let responseDatabase;
      try
      {
          response = await axios.post('https://api.intra.42.fr/oauth/token', {
          code: code,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          redirect_uri: `${process.env.NEXT_PUBLIC_FRONT_URL}login`,
          grant_type: 'authorization_code'
          });
          
          responseDatabase = CheckUserInDatabase(response.data);

          console.log('42api responses:', response.data);

      } catch (error) {

          if (error.response)
          {
              console.log('Login - error response occured');
              return (error.response);
          }
          else if (error.request)
          {
            console.log('Login - error request occured');
            return (error.request);
          }
      }

      return (responseDatabase);
  };

  
  async function CheckUserInDatabase (data:any)
  {
    let access_token;
    let status;
    let userData;

    try
    {
      userData = await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/user_check`, {
        access_token: data.access_token
      });
  
      console.log('user_check response - ', userData.data);
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
        console.log(error);
        redirect('/entrance');
    }

    return (userData);
  }


  if (code)
  {
    return (
      <div>
      {(async () => {
        try
        {
          const response = await Auth42(code);
  
          console.log ('----in response of Auth42----');
  
          responseData = response.data;
  
          console.log('');
          console.log('responseData - ', responseData);
  
          if (responseData?.refresh_token != undefined
            && responseData?.refresh_token != null)
          {
              console.log('user_check success to cookie control');
              cookie_control = true;
          }
  
          if (cookie_control == true)
          {
            return (
              <div>
                {/* <div>
                  this is server component - 42api.
                </div> */}
                  <CookieControl access_token={responseData?.access_token} refresh_token={responseData?.refresh_token} />
              </div>
            );
          }
          else
          {
            return (
              <div>
                {/* <div>
                  this is server component - 42api.
                </div> */}
                  <Signup access_token={responseData?.access_token} />
              </div>
            );
  
          }
        }
        catch
        {
          console.log('/login - fail to call Auth42');
          redirect ('/entrance');
        }
        })()}
      </div>   
    );
  }
  else
  {
    console.log('/login - no code to call Auth42');
    redirect ('/entrance');
    return (<div></div>);
  }


  // if (!code)
  // {
  //   console.log('/login - no code to call Auth42');
  //   redirect ('/entrance');
  //   return (
  //     <div></div>
  //   );
  // }

  // return (
  //   <div>
  //   {(async () => {
  //     try
  //     {
  //       const response = await Auth42(code);

  //       console.log ('----in response of Auth42----');

  //       responseData = response.data;

  //       console.log('');
  //       console.log('responseData - ', responseData);

  //       if (responseData?.refresh_token != undefined
  //         && responseData?.refresh_token != null)
  //       {
  //           console.log('user_check success to cookie control');
  //           cookie_control = true;
  //       }

  //       if (cookie_control == true)
  //       {
  //         return (
  //           <div>
  //             <div>
  //               this is server component - 42api.
  //             </div>
  //               <CookieControl access_token={responseData?.access_token} refresh_token={responseData?.refresh_token} />
  //           </div>
  //         );
  //       }
  //       else
  //       {
  //         return (
  //           <div>
  //             <div>
  //               this is server component - 42api.
  //             </div>
  //               <Signup access_token={responseData?.access_token} />
  //           </div>
  //         );

  //       }
  //     }
  //     catch
  //     {
  //       console.log('/login - fail to call Auth42');
  //       redirect ('/entrance');
  //     }
  //     })()}
  //   </div>   
  // );

}
