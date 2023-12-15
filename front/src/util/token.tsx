import axios from 'axios';
import { redirect } from 'next/navigation';
let isRefreshing = false;
let subscribers: any[] = [];

const axiosToken = axios.create();

const onTokenRefreshed = async (newToken: string) => {
  subscribers.forEach((callback) => callback(newToken));
  subscribers = [];
};

axiosToken.interceptors.response.use(
  (response) => {
      return response;
  },
  async (error) => {
      const originalRequest = error.config;
      
      if (error.response &&error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          if (!isRefreshing) {
            isRefreshing = true;

            try {
              const res = await axios.get(`${process.env.NEXT_PUBLIC_FRONT_URL}api/get_cookie`);
              const newToken = await getNewToken(res.data.access_token, res.data.refresh_token);

              axios.defaults.headers.common['Authorization'] = `Bearer ${newToken.access_token}`;
              originalRequest.headers['Authorization'] = `Bearer ${newToken.access_token}`;

              isRefreshing = false;
              onTokenRefreshed(newToken.access_token);

              return axiosToken(originalRequest);
            } catch (e) {
              // console.error('토큰 재발급 실패', e);
              window.location.href = '/';
            }
          }
          else {
            return new Promise((resolve) => {
              subscribers.push((accessToken: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                resolve(axiosToken(originalRequest));
              });
            });
          }
        }
    return Promise.reject(error);
  }
);

const getNewToken = async (access: any, refresh: any) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}auth/token/refresh`, {
      access_token: access.value
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refresh.value}`,
      },
    });
    await axios.post(`${process.env.NEXT_PUBLIC_FRONT_URL}api/set_cookie`, res.data)
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { axiosToken };
