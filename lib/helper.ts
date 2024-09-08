import { Org } from '@/constants/types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { supabase } from './supabase';
import { router } from 'expo-router';
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();
type User = {
  email: string;
  userId: string;
  name: string;
  phoneNumber: string;
  streamToken: string;
  avatar: string;
};
export const createOrg = async (orgData: Org) => {
  try {
    const { data } = await axios.post(
      'https://workserver-plum.vercel.app/organization/create',
      orgData
    );

    return data;
  } catch (error: any) {
    return { error: error.response.data.error };
  }
};

export const createToken = async (userId: string) => {
  try {
    const { data: axiosData } = await axios.post(
      'http://localhost:8989/create-token',
      {
        id: userId,
      }
    );

    return axiosData.streamToken;
  } catch (error) {
    console.log(error);
  }
};
export const checkIfUserExistsFn = async (email: string) => {
  try {
    const { data: dt, error: err } = await supabase
      .from('user')
      .select()
      .eq('email', email)
      .single();

    return dt;
  } catch (error: any) {
    console.log(error);

    return null;
  }
};

export const createUser = async (user: User) => {
  try {
    const { data, error } = await supabase
      .from('user')
      .insert(user)
      .select()
      .single();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const updateOrg = async (orgData: Org) => {
  try {
    const { data } = await axios.post(
      'https://workserver-plum.vercel.app/organization/update',
      orgData
    );

    return data;
  } catch (error: any) {
    return { error: error.response.data.error };
  }
};

export const checkLength = (value: string) => {
  if (!value) return '';
  if (value.length > 25) {
    return value.substring(0, 25) + '...';
  } else {
    return value;
  }
};

export const uploadPostImage = async (
  postUrl: string,
  organizationId: string
) => {
  const { error } = await supabase
    .from('posts')
    .insert({ postUrl, organizationId: Number(organizationId) });
  if (error) {
    throw error.message;
  }
};

export const deletePost = async (id: number) => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    throw error.message;
  }
};

export const exitWaitList = async (workspaceId: number, customerId: string) => {
  const { error: err, data } = await supabase
    .from('waitList')
    .select('*')
    .eq('workspaceId', workspaceId);
  if (!err) {
    const customerToRemove = data.find((item) => item?.customer === customerId);
    const { error } = await supabase
      .from('waitList')
      .delete()
      .eq('customer', customerToRemove?.customer as string);
  }

  router.back();
};

export const onDeleteImage = async (path: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .remove([path]);
    if (error) {
      console.log(error);
      throw error.message;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onRefresh = async (id: string) => {
  queryClient.invalidateQueries({
    queryKey: [
      'wk',
      id,
      'waitList',
      'pending_requests',
      'myStaffs',
      'connections',
      'organization',
      'assignedWk',
      'profile',
      'posts',
      'wks',
      'wk',
      'personal',
      'search',
      'search_name',
      'workers',
      'personal_workers',
      'other_workers',
      'pending_worker',
      'pending_requests',
      'worker',
      'request',
      'single',
      'single_orgs',
      'get_single_orgs',
      'use_organization',
      'followers',
    ],
    refetchType: 'all',
  });
};

export const onFollow = async (id: number, name: string, userId: string) => {
  try {
    const { error } = await supabase.from('followers').insert({
      organizationId: id,
      followerId: userId,
    });
    if (error) {
      console.log('following error', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to follow',
        text2: 'Please try again later',
        position: 'top',
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['followers', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['use_organization'],
      });
      Toast.show({
        type: 'success',
        text1: `You are now following ${name}`,
        position: 'top',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to follow',
      text2: 'Please try again later',
      position: 'top',
    });
  }
};

export const onUnFollow = async (id: number, name: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('organizationId', id)
      .eq('followerId', userId);
    if (error) {
      console.log('unfollowing error', error);

      Toast.show({
        type: 'error',
        text1: 'Failed to unfollow',
        text2: 'Please try again later',
        position: 'top',
      });
    } else {
      queryClient.invalidateQueries({
        queryKey: ['followers', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['use_organization'],
      });
      Toast.show({
        type: 'success',
        text1: `You are no longer following ${name}`,
        position: 'top',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to unfollow',
      text2: 'Please try again later',
      position: 'top',
    });
  }
};

export const checkIfEmployed = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('workspace')
      .select()
      .eq('workerId', userId)
      .single();

    if (error) {
      console.log(error);
      throw error.message;
    }

    if (!error && data?.workerId) {
      return data;
    }
    return null;
  } catch (error: any) {
    console.log(error);
    throw error?.message;
  }
};
