import React, { useEffect } from 'react';
import axios from 'axios';

const Callback = () => {
  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authorizationCode = urlParams.get('code');
      
      if (authorizationCode) {
        try {
          const response = await axios.post('https://api.intra.42.fr/oauth/token', {
            code: authorizationCode,
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            redirect_uri: 'http://localhost:3000/oauth/Callback',
            grant_type: 'authorization_code'
          });
          console.log('Authorization Code:', authorizationCode);
          console.log('data:', response.data);
          //여기서 백앤드로 토큰 전송? -> 이후 백앤드에서 토큰으로 유저 정보 받아오기
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div>
      <p>Callback Page</p>
    </div>
  );
};

export default Callback;
