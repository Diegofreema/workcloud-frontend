import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import { useGetOrg, useGetPosts, useOrgsWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { HeaderNav } from '@/components/HeaderNav';
import { Box, HStack, VStack } from '@gluestack-ui/themed';
import { Avatar } from 'react-native-paper';
import signup from '../board';
import { MyText } from '@/components/Ui/MyText';
import { colors } from '@/constants/Colors';
import { WorkerWithWorkspace } from '@/constants/types';
import { supabase } from '@/lib/supabase';
import { useData } from '@/hooks/useData';
import Toast from 'react-native-toast-message';
import { EmptyText } from '@/components/EmptyText';
import { useQueryClient } from '@tanstack/react-query';
import { PostComponent } from '@/components/PostComponent';
import Carousel from 'react-native-reanimated-carousel';
import { useDarkMode } from '@/hooks/useDarkMode';
import { MyButton } from '@/components/Ui/MyButton';
import { useChatContext } from 'stream-chat-expo';
import { FontAwesome6 } from '@expo/vector-icons';
type Props = {};

const Reception = (props: Props) => {
  const { id: userId } = useData();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, error, refetch, isPaused } = useGetOrg(id);

  const {
    data: posts,
    isPending: isPendingPosts,
    isRefetching: isRefetchingPosts,
    refetch: refetchPosts,
    isPaused: isPausedPosts,
    isError,
    isRefetchError,
  } = useGetPosts(data?.org?.id);
  const {
    data: workers,
    isPending: isPendingWorkers,
    error: errorWorkers,
    refetch: refetchWorkers,
    isPaused: isPausedWorkers,
  } = useOrgsWorkers(data?.org?.id);
  const { width } = useWindowDimensions();
  console.log(data?.org?.ownerId, userId, 'data?.org?.ownerId === userId');

  useEffect(() => {
    const createConnection = async () => {
      const { data, error: err } = await supabase
        .from('connections')
        .select('connectedTo, id')
        .eq('owner', userId);

      const connected = data?.find(
        (item) => item?.connectedTo.toString() === id
      );

      if (connected) {
        const { error } = await supabase
          .from('connections')
          .update({
            created_at: new Date(),
          })
          .eq('id', connected?.id);
      } else {
        const { error } = await supabase.from('connections').insert({
          owner: userId,
          connectedTo: id,
        });
      }

      if (error) {
        console.log(error);
      }
      if (!error) {
        queryClient.invalidateQueries({
          queryKey: ['connections', userId],
        });
      }
    };
    if (data?.org?.ownerId !== userId) createConnection();
  }, [id, userId]);

  const handleRefetch = () => {
    refetch();
    refetchWorkers();
    refetchPosts();
  };
  if (
    error ||
    isPausedWorkers ||
    isPaused ||
    errorWorkers ||
    isError ||
    isRefetchError ||
    isPausedPosts
  ) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingWorkers || isPendingPosts) {
    return <LoadingComponent />;
  }

  const { org } = data;
  const { workers: staffs } = workers;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      style={{ flex: 1, marginHorizontal: 20 }}
    >
      <HeaderNav
        title={org?.name}
        subTitle={org?.category}
        RightComponent={ReceptionRightHeader}
      />
      <HStack gap={10} alignItems="center" my={10}>
        <Avatar.Image source={{ uri: org?.avatar }} size={50} />
        <VStack>
          <MyText poppins="Medium" style={{ color: colors.nine }}>
            Opening hours:
          </MyText>

          <HStack gap={20} mb={10} alignItems="center">
            <MyText poppins="Medium">Monday - Friday</MyText>
            <HStack alignItems="center">
              <View style={styles.subCon}>
                <MyText
                  poppins="Bold"
                  style={{
                    color: colors.openBackgroundColor,
                  }}
                >
                  {org?.start}
                </MyText>
              </View>
              <Text style={{ marginBottom: 5 }}> - </Text>
              <View
                style={[
                  styles.subCon,
                  { backgroundColor: colors.closeBackgroundColor },
                ]}
              >
                <MyText
                  poppins="Bold"
                  style={{
                    color: colors.closeTextColor,
                  }}
                >
                  {org?.end}
                </MyText>
              </View>
            </HStack>
          </HStack>
        </VStack>
      </HStack>

      {posts?.imgUrls?.length > 0 && (
        <Carousel
          loop
          width={width}
          height={150}
          autoPlay={true}
          data={posts?.imgUrls}
          scrollAnimationDuration={1500}
          renderItem={({ index, item }) => (
            <View
              style={{
                width: width * 0.98,
                height: 150,
                borderRadius: 5,
                overflow: 'hidden',
              }}
            >
              <Image src={item.postUrl} style={styles.image} />
            </View>
          )}
        />
      )}
      <MyText
        poppins="Bold"
        style={{
          fontSize: 12,
          marginVertical: 20,
        }}
      >
        Representatives
      </MyText>
      <Representatives data={staffs} />
    </ScrollView>
  );
};

export default Reception;
const styles = StyleSheet.create({
  subCon: {
    paddingHorizontal: 7,
    borderRadius: 3,
    backgroundColor: colors.openTextColor,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

const Representatives = ({ data }: { data: WorkerWithWorkspace[] }) => {
  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      contentContainerStyle={{
        paddingBottom: 30,
        flexDirection: 'row',
        gap: 15,
      }}
      renderItem={({ item }) => <RepresentativeItem item={item} />}
      ListEmptyComponent={() => <EmptyText text="No representatives yet" />}
    />
  );
};

const RepresentativeItem = ({ item }: { item: WorkerWithWorkspace }) => {
  const router = useRouter();
  const { id } = useData();
  const { client } = useChatContext();
  const handlePress = async () => {
    const { data, error: err } = await supabase
      .from('waitList')
      .select()
      .eq('workspace', item?.workspaceId?.id);

    if (!err) {
      const customerInWaitList = data?.find((c) => c.customer === id);
      if (customerInWaitList) {
        const { error } = await supabase
          .from('waitList')
          .delete()
          .eq('id', customerInWaitList?.id);
        const { error: er } = await supabase.from('waitList').insert({
          workspace: item?.workspaceId?.id,
          customer: id,
        });
        if (er) {
          console.log(er);

          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'Please try joining again',
          });
        }

        if (!er) {
          Toast.show({
            type: 'success',
            text1: 'Welcome back to our workspace',
            text2: 'Please be in a quiet place',
          });
          router.replace(`/wk/${item?.workspaceId?.id}`);
        }
      } else {
        const { error } = await supabase.from('waitList').insert({
          workspace: item?.workspaceId?.id,
          customer: id,
        });

        if (error) {
          console.log(error);

          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'Please try joining again',
          });
        }

        if (!error) {
          Toast.show({
            type: 'success',
            text1: 'Welcome to our workspace',
            text2: 'Please be in a quiet place',
          });
          router.replace(`/wk/${item?.workspaceId?.id}`);
        }
      }
    }
  };

  const onPress = async () => {
    const channel = client.channel('messaging', {
      members: [id, item?.userId?.userId],
    });

    await channel.watch();

    router.push(`/chat/${channel.id}`);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
          marginBottom: 10,
        },
      ]}
      onPress={handlePress}
    >
      <VStack alignItems="center" justifyContent="center" gap={2}>
        <Avatar.Image source={{ uri: item?.userId.avatar }} size={50} />
        <MyText poppins="Medium" fontSize={11} style={{ textAlign: 'center' }}>
          {item?.role}
        </MyText>

        {item?.workspaceId && item?.workspaceId?.active && (
          <View
            style={{
              backgroundColor: colors.openTextColor,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 3,
            }}
          >
            <MyText
              poppins="Bold"
              style={{ color: colors.openBackgroundColor }}
            >
              Active
            </MyText>
          </View>
        )}
        {item?.workspaceId && !item?.workspaceId?.active && (
          <>
            <View
              style={{
                backgroundColor: colors.closeBackgroundColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
              }}
            >
              <MyText poppins="Bold" style={{ color: colors.closeTextColor }}>
                Inactive
              </MyText>
            </View>

            {item?.userId?.userId !== id && (
              <Pressable
                onPress={onPress}
                style={{
                  backgroundColor: '#C0D1FE',
                  padding: 7,
                  marginTop: 5,
                  borderRadius: 5,
                }}
              >
                <MyText poppins="Medium" style={{ color: colors.dialPad }}>
                  Message
                </MyText>
              </Pressable>
            )}
          </>
        )}
      </VStack>
    </Pressable>
  );
};

const ReceptionRightHeader = () => {
  const { darkMode } = useDarkMode();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Pressable
      style={({ pressed }) => ({ padding: 5, opacity: pressed ? 0.5 : 1 })}
      onPress={() => router.push(`/overview/${id}`)}
    >
      <FontAwesome6
        name="building-columns"
        size={24}
        color={darkMode === 'dark' ? colors.white : colors.black}
      />
    </Pressable>
  );
};
