import { Requests, Workers } from '@/constants/types';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { router, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MyText } from './MyText';

import { colors } from '@/constants/Colors';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { Button } from 'react-native-paper';
import { useData } from '@/hooks/useData';

type PreviewWorker = {
  name: any;
  imageUrl?: string;

  subText?: string | boolean;
  id?: any;
  navigate?: boolean;
  roleText?: string;
  workspaceId?: string | null;
  personal?: boolean;
  hide?: boolean;
  workPlace?: string;
  profile?: boolean;
  active?: boolean;
  workspace?: boolean;
};
export const UserPreview = ({
  id,
  imageUrl,
  subText,
  navigate,
  name,
  roleText,
  workspaceId,
  personal,
  hide,
  workPlace,
  profile,
  active,
  workspace,
}: PreviewWorker) => {
  const router = useRouter();
  const onPress = () => {
    if (!navigate) return;
    router.push(`/workerProfile/${id}`);
  };
  console.log(id);

  return (
    <Pressable onPress={onPress}>
      <HStack gap={10} alignItems="center">
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 60, height: 60, borderRadius: 9999 }}
          contentFit="cover"
        />
        <VStack>
          <MyText poppins="Bold" fontSize={16}>
            {name}
          </MyText>
          {subText && (
            <MyText poppins="Medium" fontSize={14}>
              {subText === true ? 'pending' : subText}
            </MyText>
          )}
          {roleText && (
            <MyText poppins="Medium" fontSize={14}>
              {roleText} at {workPlace}
            </MyText>
          )}

          {!roleText && profile && (
            <MyText poppins="Medium" fontSize={14}>
              Currently not with an organization
            </MyText>
          )}
          {active && workspace && (
            <View
              style={{
                backgroundColor: colors.openTextColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MyText
                poppins="Medium"
                fontSize={14}
                style={{ color: colors.openBackgroundColor }}
              >
                Active
              </MyText>
            </View>
          )}

          {!active && workspace && (
            <View
              style={{
                backgroundColor: colors.closeTextColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MyText
                style={{ color: colors.closeBackgroundColor }}
                poppins="Medium"
                fontSize={14}
              >
                Inactive
              </MyText>
            </View>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
};

export const WorkPreview = ({ item }: { item: Requests }) => {
  const { id: userId } = useData();
  const [cancelling, setCancelling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const {
    created_at,
    id,
    role,
    from,
    to,
    workspaceId,
    salary,
    responsibility,
    qualities,
  } = item;
  console.log(to);

  const queryClient = useQueryClient();

  const acceptRequest = async () => {
    setAccepting(true);
    try {
      const { error } = await supabase
        .from('workspace')
        .update({
          salary: salary,
          responsibility: responsibility,
          workerId: to?.userId,
        })
        .eq('id', workspaceId);

      const { error: err } = await supabase
        .from('worker')
        .update({
          role: role,
          bossId: from?.userId,
          workspaceId: workspaceId,
          organizationId: from?.organizationId?.id,
        })
        .eq('id', to.workerId);
      if (!error && !err) {
        const { error } = await supabase.from('request').delete().eq('id', id);
        Toast.show({
          type: 'success',
          text1: 'Request has been accepted',
        });
        queryClient.invalidateQueries({
          queryKey: ['request', from?.userId, to?.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ['single', id],
        });
        queryClient.invalidateQueries({
          queryKey: ['pending_requests', userId],
        });
        router.push('/organization');
      }
      if (error || err) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
        console.log(error || err);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setAccepting(false);
    }
  };

  const rejectRequest = async () => {
    setCancelling(true);
    try {
      const { error } = await supabase.from('request').delete().eq('id', id);

      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Request Canceled',
        });

        queryClient.invalidateQueries({
          queryKey: ['request', from?.userId, to?.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ['single', id],
        });
        queryClient.invalidateQueries({
          queryKey: ['pending_requests', userId],
        });
      }

      if (error) {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
        });
      }
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <HStack pr={20} py={10} gap={6}>
      <Image
        source={{
          uri: from?.organizationId?.avatar || 'https://placehold.co/100x100',
        }}
        style={{ width: 60, height: 60, borderRadius: 9999 }}
        contentFit="cover"
      />
      <VStack mr={10} width={'90%'} justifyContent="space-between" gap={10}>
        <MyText
          style={{ color: 'black', width: '100%', paddingRight: 5 }}
          poppins="Medium"
          fontSize={12}
        >
          {from?.organizationId?.name} wants you to be a representative on their
          workspace
        </MyText>
        <MyText style={{ color: 'black' }} poppins="Medium" fontSize={12}>
          Role : {role}
        </MyText>
        <MyText style={{ color: 'black' }} poppins="Medium" fontSize={12}>
          Responsibility : {responsibility}
        </MyText>
        <MyText style={{ color: 'black' }} poppins="Medium" fontSize={12}>
          Qualities : {qualities}
        </MyText>
        <MyText style={{ color: 'black' }} poppins="Medium" fontSize={12}>
          Payment: {salary} naira
        </MyText>

        <HStack gap={10} mt={20}>
          <Button
            contentStyle={{ backgroundColor: '#C0D1FE', borderRadius: 5 }}
            style={{ borderRadius: 5 }}
            loading={cancelling}
            onPress={rejectRequest}
            textColor="#0047FF"
          >
            <Text style={{ color: '#0047FF', fontFamily: 'PoppinsMedium' }}>
              Decline
            </Text>
          </Button>
          <Button
            contentStyle={{ backgroundColor: '#0047FF' }}
            style={{ borderRadius: 5 }}
            loading={accepting}
            onPress={acceptRequest}
            textColor="white"
          >
            <Text style={{ color: 'white', fontFamily: 'PoppinsMedium' }}>
              Accept
            </Text>
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
};
