import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;
    
    if (code) {
    const handleCallback = async () => {
      try {
        const response = await axios.post('https://api.intra.42.fr/oauth/token', {
          code: code,
          client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
          redirect_uri: 'http://127.0.0.1:3000/oauth/Callback',
          grant_type: 'authorization_code'
        });
        console.log('Code:', code);
        console.log('data:', response.data);

        const userData = await axios.post('http://10.28.4.11:4242/auth/token', response.data);
        if (userData)
          router.push('/main');
        else
          router.push('/signup');
        } catch (error) {
          console.error('Error:', error);
        }
    };

    handleCallback();
    }
  }, [router.query]);

  return (
    <div>
      <p>Callback Page</p>
    </div>
  );
};

export default Callback;

//export { userData } -> userData를 다른 파일에서 사용할 수 있게 함
