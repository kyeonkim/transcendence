import Login from './login';
import axios from 'axios';

export default async function Api42Handler ({searchParams}:any) {

  console.log('code:', searchParams.code);

  let signed;

  if (searchParams.code)
  {
    try
    {
      const response = await axios.post('https://api.intra.42.fr/oauth/token', {
        code: searchParams.code,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        grant_type: 'authorization_code'
      });

      console.log('42api responses:', response.data);
    
      const userData = await axios.post('http://10.13.9.2:4242/user/auth', {  
        access_token: response.data.access_token
      });
      console.log('userData:', userData.data);

      // console.log(userData);
      // console.log(userData.data);

      signed = userData.data.sign;
      console.log(signed);

      if (signed == false)
      {
        // access_token을 /signup으로 넘겨줘야한다.
        // context api or state management library 사용
      }

    } catch (error) {
          

    }
  }

  return (
      <Login signed={signed}/>
  );

}