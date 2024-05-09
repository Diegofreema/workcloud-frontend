import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { useGetRequest, usePendingRequest } from '@/lib/queries';
import { useData } from '@/hooks/useData';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { router, useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { HStack, VStack } from '@gluestack-ui/themed';
import { MyText } from '@/components/Ui/MyText';
import { Image } from 'expo-image';
import { MyButton } from '@/components/Ui/MyButton';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

type Props = {};

const Request = (props: Props) => {
  const { requestId } = useLocalSearchParams();
  const { id } = useData();
  const queryClient = useQueryClient();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
    error: er,
  } = useGetRequest(requestId);
  const [cancelling, setCancelling] = useState(false);
  const [accepting, setAccepting] = useState(false);

  if (isError || isRefetchError || isPaused || data?.error) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const { request } = data;
  const acceptRequest = async () => {
    setAccepting(true);
    try {
      const { error } = await supabase
        .from('workspace')
        .update({
          salary: request?.salary,
          responsibility: request?.responsibility,
          workerId: request?.to?.userId,
        })
        .eq('id', request?.workspaceId);

      const { error: err } = await supabase
        .from('worker')
        .update({
          role: request?.role,
          bossId: request?.from?.userId,
          workspaceId: request?.workspaceId,
          organizationId: request?.from?.organizationId?.id,
        })
        .eq('id', request.to.workerId);
      if (!error && !err) {
        Toast.show({
          type: 'success',
          text1: 'Request has been accepted',
        });
        queryClient.invalidateQueries({
          queryKey: [
            'request',
            'single',
            'worker',
            'pending_requests',
            'pending_worker',
            'myStaffs',
          ],
        });
        router.replace(`/wk/${data?.request?.workspaceId}`);
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
      const { error } = await supabase
        .from('request')
        .delete()
        .eq('id', requestId);

      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Request Canceled',
        });

        queryClient.invalidateQueries({
          queryKey: ['request', request.from?.userId, request.to.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ['single', requestId],
        });
        queryClient.invalidateQueries({
          queryKey: ['pending_requests', id],
        });

        router.back();
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
    <Container flex={1}>
      <HeaderNav title="Request" />
      <VStack>
        <View style={{ marginBottom: 20 }}>
          <Image
            source={request?.from?.organizationId?.avatar}
            style={{ width: '100%', height: 200, borderRadius: 6 }}
            contentFit="cover"
          />
        </View>
        <MyText
          fontSize={18}
          poppins="Medium"
          style={{ textTransform: 'capitalize' }}
        >
          {formatDistanceToNow(request?.created_at)} ago
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          From : {request?.from?.organizationId?.name}
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          Responsibilities : {request?.responsibility}
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          Salary : {request?.salary}
        </MyText>
        <MyText fontSize={18} poppins="Medium">
          Role : {request?.role}
        </MyText>
      </VStack>
      <HStack mt={'auto'} mb={30} gap={10}>
        <MyButton
          loading={cancelling}
          buttonColor="red"
          style={{ width: '50%' }}
          onPress={rejectRequest}
        >
          Decline
        </MyButton>
        <MyButton
          loading={accepting}
          style={{ width: '50%' }}
          onPress={acceptRequest}
        >
          Accept
        </MyButton>
      </HStack>
    </Container>
  );
};

export default Request;
