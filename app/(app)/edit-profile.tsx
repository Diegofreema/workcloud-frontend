import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { defaultStyle } from '../../constants/index';
import { HeaderNav } from '../../components/HeaderNav';
import { ProfileUpdateForm } from '../../components/Forms/ProfileUpdateForm';
import { CompleteDialog } from '../../components/Dialogs/SavedDialog';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Person, Profile } from '@/constants/types';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { useData } from '@/hooks/useData';
import { Container } from '../../components/Ui/Container';

const Update = () => {
  const { userId } = useLocalSearchParams();
  const { id } = useData();
  const queryClient = useQueryClient();
  const [person, setPerson] = useState<Profile | null>();
  const router = useRouter();
  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user')
          .select(
            `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
          )
          .eq('userId', id)
          .single();
        if (!error) {
          // @ts-ignore
          setPerson(data);
        }
        if (error) {
          console.log(error);

          router.back();
        }

        return data;
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
        router.back();
      }
    };
    const getUser = async () => {
      queryClient.fetchQuery({
        queryKey: ['profile', userId],
        queryFn: getProfile,
      });
    };

    getUser();
  }, []);

  console.log(person);

  return (
    <>
      <CompleteDialog text="Changes saved successfully" />

      <Container>
        <HeaderNav title="Edit Profile" />
        <ProfileUpdateForm person={person} />
      </Container>
    </>
  );
};

export default Update;
