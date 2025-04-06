import { fdAxios } from '@/config/axios.config';
import { API_ROUTES } from '@/const/routes';

export const login = async (identifier: string, password: string) => {
  const response = await fdAxios.post(API_ROUTES.LOGIN, {
    identifier,
    password,
  });
  return response.data;
};
