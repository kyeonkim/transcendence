import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';

const GuardLogin = ({ children }: any ) => {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log('GuardLogin: getCookie:', getCookie('access_token'));
      console.log('GuardLogin: getRefreshCookie:', getCookie('refresh_token'));


      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}auth/token/varify`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('access_token')}`,
        },
      })
      .then((response) => {
        console.log('GuardLogin: Response:', response);
        })
      .catch(async function (error) {
        console.log('GuardLogin: Error:', error);
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/token/refresh`,{
          access_token: getCookie('access_token'),
        } ,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('refresh_token')}`,
          }
          })
          .then((response) => {
            setCookie('access_token', response.data.access_token, {
              maxAge: 100000,
                // httpOnly: true,
              });
            setCookie('refresh_token', response.data.refresh_token, {
              maxAge: 100000,
                // httpOnly: true,
              });
            })
          .catch(function (error) {
            console.error('GuardLogin: Refresh Error:', error);
            deleteCookie('access_token');
            deleteCookie('refresh_token');
            router.push('/');
          });
      });
    };

    checkLoginStatus();
  }, []);

  return children;
};

export default GuardLogin;
