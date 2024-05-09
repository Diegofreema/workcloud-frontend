import { Org } from '@/constants/types';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { supabase } from './supabase';
import { router } from 'expo-router';
import { QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();
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
    .insert({ postUrl, organizationId });
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
      .eq('customer', customerToRemove?.customer);
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
    ],
    refetchType: 'all',
  });
};
