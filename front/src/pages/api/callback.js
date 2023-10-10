// api/callback.js

import axios from 'axios';

export default async (req, res) => {
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

    console.log('response:', response.data);

    // Send the response data to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error);

    // Send an error response to the client
    res.status(500).json({ error: 'Internal server error' });
  }
};
