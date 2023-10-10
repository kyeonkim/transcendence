import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  console.log('code:', code);

  try {
    const response = await axios.post('https://api.intra.42.fr/oauth/token', {
      code: code,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      redirect_uri: 'http://10.28.4.14:3000/api/callback',
      grant_type: 'authorization_code'
    });

    res.status(200).json({ data: response.data });
    // res.status(200);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error 2' });
  }
};

export default handler;