import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;

  console.log('req: ', req.query)
  if (code)
  {
    try {
      const response = await axios.post('https://api.intra.42.fr/oauth/token', {
        code: code,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
        redirect_uri: 'http://10.28.4.14:3000/oauth/Login',
        grant_type: 'authorization_code'
      });
  
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error 2' });
    }
  }
};
