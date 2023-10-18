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
        await axios.post('/api/callback', null, {
          params: {
            code: code
          }
        })
        .then(async (response) => {
          console.log('responseData:', response.data);
            
          await axios.post('http://10.13.9.2:4242/auth/login', response.data)
          .then((response) => {
            console.log('userData:', response);
            setCookie('access_token', response.data.token.access_token, {
              maxAge: 100000,
                // httpOnly: true,
              });
            setCookie('refresh_token', response.data.token.refresh_token, {
              maxAge: 100000,
                // httpOnly: true,
              });
            router.push('/main');
            })
            .catch((error) => {
              console.log("Need sign up");
              router.push({
                pathname: '/signup',
                query: { oauth_token: response.data.access_token },
                }, '/signup');
            });
        })
        .catch(function (error) {
          console.log("Error Callback: ", error);
        });
        };
      handleCallback();
    }
    }, [code]);

  return (
    <div>
      <p>Callback Page - Loading</p>
    </div>
  );
};

export default Login;
