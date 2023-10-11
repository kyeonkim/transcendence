'use client'
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { useEffect} from 'react';

export default function Main() {
  const router = useRouter();
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);

  const { access_token, refresh_token } = router.query;


  const setCookieHandler = () => {
    setCookie('access_token', access_token, {
      path: '/',
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
      // httpOnly: true,
      Secure: true
    });
    setCookie('refresh_token', refresh_token, {
      path: '/',
      maxAge: 3600, // Expires after 1hr
      sameSite: true,
      // httpOnly: true,
      Secure: true
    });
  }

  useEffect(() => {
    setCookieHandler();
    console.log('Cookies: ', cookies);
}, [cookies]);

  return (
      <div>
        <h1>main</h1>
      </div>
    )
  }
  