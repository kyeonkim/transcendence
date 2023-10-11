import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {

    console.log('code:', code);
    if (code) {
      const handleCallback = async () => {
        try {
          const response = await axios.post('/api/callback', null, {
            params: {
              code: code
            }
          });
          /*
          access_token/sign 
          
          sign(true)-> to main(api)
          
          (false)-> to signup
          */
          // const userData = await axios.post('http://10.13.9.4:4242/auth/token' , response.data);
          // console.log('userData:', userData);
          // if (userData.data.sign)
            router.push({
            pathname: '/main',
            query: { access_token: '123',
                     refresh_token: '2341'
            },
          },
          '/main');
          // else
          //   router.push({
          //     pathname: '/signup',
          //     query: { oauth_token: '2323' },
          //     },
          //     '/signup');
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
