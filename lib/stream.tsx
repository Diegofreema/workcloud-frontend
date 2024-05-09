import { StyleSheet, View, Text } from 'react-native';
import {
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-native-sdk';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useData } from '@/hooks/useData';
import { Profile } from '@/constants/types';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY!;

const client = new StreamVideoClient({ apiKey });
type Props = {
  children: React.ReactNode;
};
export const StreamClientProvider = ({ children }: Props): JSX.Element => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const queryClient = useQueryClient();
  const { id } = useData();
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('user')
        .select(
          `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
        )
        .eq('userId', id)
        .single();

      return data;
    };
    const getProfile = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['profile', id],
        queryFn: fetchProfile,
      });
      // @ts-ignore
      setProfile(data);
    };
    getProfile();
  }, []);
  useEffect(() => {
    if (!profile) return;
    const onConnectUser = async () => {
      await client.connectUser(
        {
          id: profile.userId.toString(),
          name: profile.name,
          image: profile.avatar,
        },
        profile?.streamToken
      );
    };

    onConnectUser();

    return () => {
      client.disconnectUser();
    };
  }, [profile, client]);
  return <StreamVideo client={client}>{children}</StreamVideo>;
};

const styles = StyleSheet.create({});
