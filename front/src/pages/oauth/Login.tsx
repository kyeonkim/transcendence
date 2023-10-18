import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import userData from '../user_auth';
import { deleteCookie } from 'cookies-next';
import { setCookie } from 'cookies-next';
const Login = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {

    if (code) {
      const handleCallback = async () => {
        try {
          const response = await axios.post('/api/callback', null, {
            params: {
              code: code
            }
          })
          console.log('responseData:', response.data);
          
          const userData = await axios.post('http://10.13.9.2:4242/user/auth', response.data);
                    
          console.log('userData:', userData);
          if (userData.data.sign)
          {
            setCookie('access_token', userData.data.token.access_token, {
              maxAge: 60 * 3,
              // httpOnly: true,
            });
            setCookie('refresh_token', userData.data.token.refresh_token, {
              maxAge: 60 * 3,
              // httpOnly: true,
            });
            router.push('/main');
          }
          else
            router.push({
              pathname: '/signup',
              query: { oauth_token: userData.data.access_token },
              }, '/signup');
        } catch (error) {
          console.error('Error:', error);
          
        }
      }
        handleCallback();
      };
    }, [code]);

  return (
    <div>
      <p>Callback Page - Loading</p>
    </div>
  );
};

export default Login;
