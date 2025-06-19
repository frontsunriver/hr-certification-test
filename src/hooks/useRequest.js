import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import client from '../api/client';

const getRequests = async () => {
  const response = await client.get('/requests');
  return response.data;
};

const postRequest = async (requestData) => {
  const response = await client.post('/requests', requestData);
  return response.data;
};

const updateRequest = async ({ id, data }) => {
  const response = await client.patch(`/requests/${id}`, data);
  return response.data;
};

export const useRequests = () => {
  return useQuery({
    queryKey: ['requests'],
    queryFn: getRequests,
  });
};

export const usePostRequest = (onSuccess) => {
  return useMutation({
    mutationFn: postRequest,
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => {
      updateRequest({ id, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['requests']);
    },
  });
};
