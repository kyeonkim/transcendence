import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    console.log('code:', code);
    if (code) {
      const handleCallback = async () => {
        try {
          const response = await axios.post('/api/callback', null, {
            params: {
              code: code
            }
          });
          console.log('data:', response.data);
          const userData = await axios.post('http://10.28.4.11:4242/auth/token' , response.data);
          if (userData)
            router.push('/main');
          else
            router.push('/signup');
        } catch (error) {
          console.error('Error:', error);
          }
        }
        handleCallback();
      };
    }, [router.query]);

  return (
    <div>
      <p>Callback Page</p>
    </div>
  );
};

export default Login;
