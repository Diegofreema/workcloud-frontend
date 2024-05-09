import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HStack, ScrollView, VStack } from '@gluestack-ui/themed';
import { HeaderNav } from '@/components/HeaderNav';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetRequests, useGetWorkerProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import { MyButton } from '@/components/Ui/MyButton';
import { colors } from '@/constants/Colors';
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { MyText } from '@/components/Ui/MyText';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { useChatContext } from 'stream-chat-expo';
import { useData } from '@/hooks/useData';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import { Button } from '@rneui/themed';
import { Container } from '@/components/Ui/Container';
import { useDarkMode } from '@/hooks/useDarkMode';
type Props = {};

const Profile = (props: Props) => {
  const { profileId } = useLocalSearchParams<{ profileId: string }>();
  // console.log('🚀 ~ Profile ~ profileId:', profileId);
  const { client } = useChatContext();
  const { user, id } = useData();
  const { darkMode } = useDarkMode();
  const [cancelling, setCancelling] = useState(false);
  const [isInPending, setIsInPending] = useState(false);
  const router = useRouter();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetWorkerProfile(profileId);

  const {
    data: pendingData,
    isPending: isPendingData,
    isError: isErrorData,
    isPaused: isPausedData,
    refetch: refetchData,
    isRefetching: isRefetchingData,
    isRefetchError: isRefetchErrorData,
    error,
  } = useGetRequests(id, profileId);
  console.log(pendingData, 'Pending Data');

  const queryClient = useQueryClient();
  useEffect(() => {
    if (pendingData?.request?.pending === true) {
      setIsInPending(true);
    } else {
      setIsInPending(false);
    }
  }, [pendingData]);
  const handleRefetch = () => {
    refetch();
    refetchData();
  };
  if (isError || isRefetchError || isErrorData || isPaused || isPausedData) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPending || isPendingData) {
    return <LoadingComponent />;
  }

  const startChannel = async () => {
    const channel = client.channel('messaging', {
      members: [user?.id as string, profileId],
    });

    await channel.watch();

    router.push(`/chat/${channel.id}`);
  };

  const formattedSkills = (text: string) => {
    const arrayOfSkills = text?.split(',');
    const finishedText = arrayOfSkills?.map((skill, index) => (
      <MyText poppins="Bold" key={index} style={{ color: colors.nine }}>
        {index + 1}. {skill}
      </MyText>
    ));
    return finishedText;
  };
  // const sendMessage = () => {};
  const cancelRequest = async () => {
    setCancelling(true);
    try {
      const { error } = await supabase
        .from('request')
        .delete()
        .eq('id', pendingData.request.id);

      if (!error) {
        Toast.show({
          type: 'success',
          text1: 'Request Canceled',
        });
        queryClient.invalidateQueries({
          queryKey: ['request', id, profileId],
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

  const { worker } = data;

  const handleRequest = () => {
    if (!isInPending) {
      router.push(`/completeRequest/${profileId}`);
      return;
    }

    cancelRequest();
  };
  return (
    <Container>
      <ScrollView>
        <HeaderNav title="Profile" />
        <View style={{ marginTop: 10 }}>
          <UserPreview
            imageUrl={worker?.userId?.avatar}
            name={worker?.userId?.name}
            roleText={worker?.role}
            workPlace={worker?.organizationId?.name}
            personal
            profile
          />
        </View>

        <HStack gap={20} mt={20}>
          {worker?.bossId !== id && (
            <Button
              onPress={handleRequest}
              loading={cancelling}
              titleStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
              buttonStyle={{
                backgroundColor: colors.dialPad,
                borderRadius: 5,
              }}
            >
              {isInPending ? 'Cancel Request' : 'Send Request'}
            </Button>
          )}

          <Button
            onPress={startChannel}
            loading={cancelling}
            titleStyle={{
              fontFamily: 'PoppinsMedium',
              color: 'blue',
              fontSize: 12,
            }}
            buttonStyle={{
              backgroundColor: colors.lightBlueButton,
              borderRadius: 5,
            }}
          >
            Send Message
          </Button>
        </HStack>

        <VStack mt={20} gap={15}>
          <HStack gap={5} alignItems="center">
            <AntDesign name="calendar" size={24} color={colors.grayText} />
            <MyText
              fontSize={12}
              poppins="Medium"
              style={{ color: colors.grayText }}
            >
              Joined since {format(worker?.created_at, 'do MMMM yyyy')}
            </MyText>
          </HStack>
          <HStack gap={5} alignItems="center">
            <EvilIcons name="location" size={24} color={colors.grayText} />
            <MyText
              fontSize={12}
              poppins="Medium"
              style={{ color: colors.grayText }}
            >
              {worker?.location}
            </MyText>
          </HStack>
        </VStack>

        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Qualifications
          </MyText>

          <HStack
            gap={10}
            alignItems="center"
            pb={40}
            style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
          >
            <SimpleLineIcons
              name="graduation"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <MyText poppins="Medium" fontSize={12}>
              {worker?.qualifications}
            </MyText>
          </HStack>
        </VStack>
        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Experience and Specialization
          </MyText>

          <HStack
            gap={10}
            alignItems="center"
            pb={40}
            style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
          >
            <SimpleLineIcons
              name="graduation"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <MyText poppins="Medium" fontSize={12}>
              {worker?.experience}
            </MyText>
          </HStack>
        </VStack>

        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Skills
          </MyText>

          <HStack
            gap={10}
            pb={40}
            style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
          >
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <VStack gap={5}>{formattedSkills(worker?.skills)}</VStack>
          </HStack>
        </VStack>
      </ScrollView>
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({});
