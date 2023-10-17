import axios from 'axios';


async function userData()
{
    // try{
    //     const response = await axios.post('http://10.13.9.2:4242/user/auth');
    //     console.log('ServerResponseData', response);
    //     res.status(200).json(response.data);
    // } catch (error) {
    //     res.status(500).json({ error: 'Internal server error' });
    // }
    const data = { sign: false };
    return data;
}

export default userData;