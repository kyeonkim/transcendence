import React, { useEffect } from 'react';
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
          const userData = await axios.post('http://10.28.4.11:4242/auth/token' , response.data);
          if (userData)
            router.push('/main');
          else
            router.push('/signup');
        } catch (error) {
          console.error('Error:', error.response.data);
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
