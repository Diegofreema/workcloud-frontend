import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';

import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useGetFollowers,
  useGetPersonalWk,
  useOrg,
  usePersonalOrgs,
} from '../../../lib/queries';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { colors } from '../../../constants/Colors';
import { EvilIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { ErrorComponent } from '../../../components/Ui/ErrorComponent';

import { useCreate } from '../../../hooks/useCreate';
import { LoadingComponent } from '../../../components/Ui/LoadingComponent';
import { useData } from '@/hooks/useData';
import { CreateWorkspaceModal } from '@/components/Dialogs/CreateWorkspace';
import { SelectRow } from '@/components/Dialogs/SelectRow';
import { DeleteWksSpaceModal } from '@/components/Dialogs/DeleteWks';
import { AuthHeader } from '@/components/AuthHeader';
import { Image } from 'expo-image';
import { WorkspaceDetails } from '@/components/WorkspaceDetails';
import { Button } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/constants/types';
import { MyText } from '@/components/Ui/MyText';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { MyButton } from '@/components/Ui/MyButton';
import { Box } from '@gluestack-ui/themed';
import Toast from 'react-native-toast-message';
import { onFollow, onUnFollow } from '@/lib/helper';

type Props = {};
type SubProps = {
  name: any;
  text: any;
  website?: boolean;
};

export const OrganizationItems = ({ name, text, website }: SubProps) => {
  const { darkMode } = useDarkMode();

  if (website) {
    return (
      <Pressable
        onPress={() => Linking.openURL('https://' + text)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
      >
        <EvilIcons
          color={darkMode === 'dark' ? colors.white : colors.textGray}
          name={name}
          size={24}
        />
        <MyText
          poppins="Bold"
          style={{
            color: colors.buttonBlue,

            fontSize: 10,
          }}
        >
          {text}
        </MyText>
      </Pressable>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <EvilIcons
        color={darkMode === 'dark' ? colors.white : colors.textGray}
        name={name}
        size={24}
      />
      <Text
        style={{
          color: darkMode === 'dark' ? colors.white : colors.textGray,
          fontFamily: 'PoppinsBold',
          fontSize: 10,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
const Overview = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [following, setFollowing] = useState(false);
  console.log(id);
  const { id: userId } = useData();
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { width } = useWindowDimensions();
  const { data, isPending, error, refetch, isPaused } = useOrg(id);
  const {
    data: followersData,
    isPending: isPendingFollowers,
    refetch: refetchFollowers,
    isPaused: isPausedFollowers,
    isError,
  } = useGetFollowers(id);
  const isFollowingMemo = useMemo(() => {
    if (!followersData) return false;
    console.log('changed');
    const isFollowing = followersData?.followers.find(
      (f) => f?.followerId === userId
    );
    if (isFollowing) {
      return true;
    } else {
      return false;
    }
  }, [followersData]);
  useEffect(() => {
    const channel = supabase
      .channel('workcloud')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'followers',
        },
        (payload) => {
          if (payload) {
            queryClient.invalidateQueries({ queryKey: ['followers', id] });
          }
          console.log('FollowersChange received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const handleRefetch = () => {
    refetch();
    refetchFollowers();
  };

  if (error || isPaused || isError || isPausedFollowers) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingFollowers) {
    return <LoadingComponent />;
  }

  const { followers } = followersData;

  const onHandleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowingMemo) {
        await onUnFollow(organization?.id, organization?.name, userId);
        setFollowing(false);
      } else {
        onFollow(organization?.id, organization?.name, userId);
        setFollowing(true);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: `Failed to ${isFollowingMemo ? 'unfollow' : 'follow'}`,
        text2: 'Please try again later',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const { organization, error: err } = data;

  const startDay = organization?.workDays?.split('-')[0];
  const endDay = organization?.workDays?.split('-')[1];
  const unfollowingText = loading ? 'UnJoining...' : 'UnJoin';
  const followingText = loading ? 'Joining...' : 'Join';
  return (
    <Container>
      <HeaderNav title={organization?.name} subTitle={organization?.category} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
            <Image
              style={{ width: 70, height: 70, borderRadius: 50 }}
              contentFit="cover"
              source={{ uri: organization?.avatar }}
            />
            <View>
              <Text
                style={{
                  fontFamily: 'PoppinsBold',
                  maxWidth: width * 0.7,
                  fontSize: 12,
                  color: darkMode === 'dark' ? colors.white : colors.black,
                }}
              >
                {organization?.description}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            borderTopColor: darkMode ? colors.white : colors.gray,
            borderTopWidth: 1,
            paddingTop: 10,
          }}
        >
          <MyText
            poppins="Light"
            style={{
              fontSize: 13,
            }}
          >
            Opening hours:
          </MyText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'PoppinsBold',
                fontSize: 10,

                color: darkMode === 'dark' ? colors.white : colors.black,
                textTransform: 'uppercase',
              }}
            >
              {startDay} - {endDay}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: '#CCF2D9',
                }}
              >
                <Text
                  style={{
                    color: '#00C041',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}
                >
                  {organization?.start}
                </Text>
              </View>
              <Text style={{ marginBottom: 8 }}> — </Text>
              <View
                style={{
                  backgroundColor: '#FFD9D9',

                  padding: 5,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    color: '#D61B0C',
                    fontFamily: 'PoppinsBold',
                    fontSize: 10,
                  }}
                >
                  {organization?.end}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            gap: 10,
            marginTop: 15,
          }}
        >
          <OrganizationItems name="envelope" text={organization?.email} />
          <OrganizationItems name="location" text={organization?.location} />
          <OrganizationItems name="link" text={organization?.website} website />
          <Text
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 12,
              color: darkMode === 'dark' ? colors.white : colors.black,
            }}
          >
            Members {followers?.length}
          </Text>
        </View>
        <Box mt={10}>
          <MyButton
            onPress={onHandleFollow}
            disabled={loading}
            contentStyle={{ height: 50 }}
          >
            {isFollowingMemo ? unfollowingText : followingText}
          </MyButton>
        </Box>
      </ScrollView>
    </Container>
  );
};

export default Overview;

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
