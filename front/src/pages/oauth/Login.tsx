import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      const handleCallback = async () => {
        try {
          const response = await axios.post('/api/callback', { code });
          console.log('data:', response.data);

          if (response.data.userData) {
            router.push('/main');
          } else {
            router.push('/signup');
          }
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

export default Login;
