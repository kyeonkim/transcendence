import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import userData from '../user_auth';

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
          
          // server-side 테스트용 api 접근 코드
          // const userData = await axios/api/user_aut.post('h', response.data);
          // const userData = await axios.get('/api/user_auth', response.data);
          
          // const data = await userData();
          // console.log('data:', data);
          // console.log('userData:', userData);
          if (userData.data.sign)
            router.push({
            pathname: '/main',
            query: {
              access_token: userData.data.access_token,
              refresh_token: userData.data.refresh_token,
              },
            }, '/main');
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
