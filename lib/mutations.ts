import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Profile } from '../constants/types';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { useRouter } from 'expo-router';

const API = process.env.EXPO_PUBLIC_API!;

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({}: Profile) => {
      try {
        const { data } = await axios.post('http://localhost:3000/', {
          email: '',
          user_id: 'user_id',
          name: name,
          avatarUrl: '',
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again',
      });

      router.replace('/');
    },
  });
};
