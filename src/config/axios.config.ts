import { useUserStore } from '@/stores/user-store';
import Axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337/api';

const axiosOptions = {
  baseURL: baseUrl,
  timeout: 60000 * 5, // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
  maxContentLength: 1024 * 1024 * 1024, // 1GB limit
  maxBodyLength: 1024 * 1024 * 1024, // 1GB limit
};

const getCurrentAccessToken = async () => {
  const token = useUserStore.getState().jwt;
  if (!token) {
    return null;
  }
  return token;
};

export const fdAxios = Axios.create(axiosOptions);

// request interceptor to add token to request headers
fdAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getCurrentAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
fdAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // If no response or message, return the original error
    return Promise.reject(error);
  }
);
