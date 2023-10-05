import { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Callback = (): JSX.Element => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      const clientId = 'u-s4t2ud-a530d138cf1c33d448191cb250ee026f61f01d4d4cbbe62e0ff18ee285f9f290';
      const clientSecret = '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';
      const redirectUri = 'http://10.13.8.3:3000/oauth/callback';

      console.log('code: ', code);

      const url = 'https://api.intra.42.fr/oauth/token';
      const data = {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        scope: 'public'
      };

      const fetchData = async () => {
        try {
          const response = await axios.post(url, data, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // 임시적인 설정으로 CORS 정책 우회
            },
          });
          console.log('response: ', response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [router.query]);

  return <div>Callback Page</div>;
};

export default Callback;
