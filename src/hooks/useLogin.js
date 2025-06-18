import { useMutation } from '@tanstack/react-query';
import client from '../api/client';

export const login = async (credentials) => {
  const { data } = await client.post('/login', credentials);
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
