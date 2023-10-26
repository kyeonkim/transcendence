
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
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
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
      userData = await axios.post('http://10.13.8.1:3000/api/user_check', {
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

  // this.Auth42(code)
  //         .then(function (response:any) {
  //           console.log ('----in response of Auth42----');

  //           responseData = response.data;
  
  //           console.log('');
  //           console.log('responseData - ', responseData);
  
  //           if (responseData?.refresh_token != undefined
  //             && responseData?.refresh_token != null)
  //           {
  //               console.log('user_check success to cookie control');
  //               cookie_control = true;
  //           }

  //           <div>
  //             {cookie_control? (
  //             <div>
  //               <p>this is server component - 42api.</p>
  //                 <CookieControl access_token={responseData?.access_token} refresh_token={responseData?.refresh_token} />
  //             </div>
  //             ) : (
  //             <div>
  //               <p>this is server component - 42api.</p>
  //                 <Signup access_token={responseData?.access_token} />
  //             </div>
  //           )}
  //           </div>
  //          }, function (error) {
  //           console.log('/login - fail to call Auth42');
  //           redirect ('/entrance');
  //       })

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
                  <p>this is server component - 42api.</p>
                    <CookieControl access_token={responseData?.access_token} refresh_token={responseData?.refresh_token} />
                </div>
              );
            }
            else
            {
              return (
                <div>
                <p>this is server component - 42api.</p>
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
          })()};
      </div>
    );

  }
  else
  {
    console.log('/login - no code to call Auth42');
    redirect ('/entrance');
  }

  

  // return (
  //   <div>
  //     <p> /login - User Checking...... </p>
  //   </div>
  // );


  // return (
  //   <div>
  //     {cookie_control? (
  //     <div>
  //       <p>this is server component - 42api.</p>
  //         <CookieControl access_token={responseData?.access_token} refresh_token={responseData?.refresh_token} />
  //     </div>
  //     ) : (
  //     <div>
  //       <p>this is server component - 42api.</p>
  //         <Signup access_token={responseData?.access_token} />
  //     </div>
  //   )}
  //   </div>
  // );

  // 이미 등록된 상태에서 동기화 문제로 인해 원하는 렌더링이 안됨.

  // return (
  //   <div>
  //     {/* <p>this is server component - 42api.</p>
  //         <Signup access_token={access_token} /> */}
  //     <p>this is server component - 42api.</p>
  //         <CookieControl access_token={userData?.data.data.access_token} refresh_token={userData?.data.data.refresh_token}/>
  //   </div>
  // );

}
