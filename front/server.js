const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 4000; // 프록시 서버 포트

app.use(express.json());

app.use('/api', (req, res) => {
  const apiUrl = 'https://api.intra.42.fr'; // 실제 API 서버 URL
  const { path, method, params } = req.body;

  axios({
    method,
    url: `${apiUrl}${path}`,
    params,
  })
    .then(apiRes => {
      res.send(apiRes.data);
    })
    .catch(error => {
      res.status(500).send('Error: Unable to process the request.');
    });
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
