import axios from 'axios';
// import { cookies } from 'next/headers';
import { useCookies } from 'next-client-cookies';

const axiosToken = axios.create();

axiosToken.interceptors.response.use(
	(response) => {
	  return response;
	},
	async (error) => {
	  const originalRequest = error.config;

		console.log('interceptor error - ', error);

	  if (error.response.status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;

		try {
		  const newToken = await getNewToken();
		  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
		  originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
		  return axios(originalRequest);
		} catch (e) {
		  console.error('토큰 재발급 실패', e);
		  // redirect('/entrance');
		}
	  }
  
	  return Promise.reject(error);
	}
  );

	const getNewToken = async () => {
		// const cookies = useCookies();
		// const cookie = cookies();

		try {
			const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/token/refresh`, {
				// access_token: cookies.get('access_token'),
			}
			,
			{
				headers: {
					'Content-Type': 'application/json',
					// 'Authorization': `Bearer ${cookies.get('refresh_token')}`,
				},
			}
			);
			console.log('getNewToken - res - ', res);
			return res.data.token;
		} catch (error) {
			console.error('토큰 재발급 요청 실패', error);
			throw error;
	};
}

export default axiosToken;