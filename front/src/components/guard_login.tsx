import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

const GuardLogin = ({ children }: any ) => {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log('GuardLogin: getCookie:', getCookie('access_token'));
      console.log('GuardLogin: getCookie:', getCookie('refresh_token'));

      const response = await axios.get('http://10.13.9.2:4242/auth/token/varify', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('access_token')}`,
        },
      })
      .catch(async function (error) {
        if (error.response && error.response.status === 401) {
          const refresh = await axios.post('http://10.13.9.2:4242/auth/', {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${getCookie('refresh_token')}`,
            },
            parmams: {
              access_token: getCookie('access_token'),
            },
            })
            .then(function (refresh) {
              console.log('GuardLogin: Refresh response:', refresh);
              })
            .catch(function (error) {
              console.error('GuardLogin: Refresh Error:', error);
              deleteCookie('access_token');
              deleteCookie('refresh_token');
              router.push('/');
            });
          }
        });
      console.log('GuardLogin: response:', response);
    };

    checkLoginStatus();
  }, []);

  return children;
};

export default GuardLogin;
