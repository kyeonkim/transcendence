import { permanentRedirect } from 'next/navigation';
import axios from 'axios';

import Signup from './signup';

import { setCookie } from 'cookies-next';

export default async function Login ({searchParams}:any) {

  console.log('code:', searchParams.code);

  let status = false;
  const code = searchParams.code;

  let access_token;
  let userData;

  if (code)
  {
      try
      {
          const response = await axios.post('https://api.intra.42.fr/oauth/token', {
          code: code,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          grant_type: 'authorization_code'
          });

          console.log('42api responses:', response.data);
      
          userData = await axios.post('http://10.13.9.2:4242/auth/login', {  
          access_token: response.data.access_token
          });
          console.log('Login - userData:', userData.data);
      
          // signed를 안주는 식으로 변경된 것 같음.
          // 동작 질묺드려보기.
            // sign으로 주는 부분과 signed로 주는 부분이 있는건가? 확인 필요

          
          access_token = userData.data.access_token;
          status = userData.data.status;


      } catch (error) {
           console.log('Login - error occured');
           return (
            <></>
           );
      }

      if (status == true)
      {
          setCookie('access_token', userData.data.access_token, {
            maxAge: 60 * 3,
            // httpOnly: true,
          });
          setCookie('refresh_token', userData.data.refresh_token, {
            maxAge: 60 * 3,
            // httpOnly: true,
          });
          permanentRedirect('/main_frame');
          // permanentRedirect는 NEXT_REDIRECT error를 바로 던져서 해당 route의 rendering을 막는다.
      }
  }

  // 이미 등록된 상태에서 동기화 문제로 인해 원하는 렌더링이 안됨.

  return (
    <div>
      <p>this is server component - 42api.</p>
          <Signup access_token={access_token} />
    </div>
      // <Login signed={signed}/>
  );

}