import { Pressable, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { HeaderNav } from '../../../components/HeaderNav';
import { defaultStyle } from '../../../constants/index';
import { TopCard } from '../../../components/LoggedInuser/TopCard';
import { BottomCard } from '../../../components/LoggedInuser/BottomCard';
import { MiddleCard } from '../../../components/LoggedInuser/MiddleCard';

import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useGetConnection, useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/constants/types';
import { IconButton } from 'react-native-paper';
import { useDarkMode } from '@/hooks/useDarkMode';
import { MyText } from '@/components/Ui/MyText';
import { HStack } from '@gluestack-ui/themed';

const MyProfile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: connections,
    refetch: refetchConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,

    isPaused: isConnectionsPaused,
  } = useGetConnection(id);
  const [user, setUser] = useState<Profile | null>();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  console.log('🚀 ~ MyProfile ~ user:', user);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLoading(true);
    const getProfile = async () => {
      const { data, error } = await supabase
        .from('user')
        .select(
          `name, avatar, streamToken, email, userId , organizationId (*), workerId (*)`
        )
        .eq('userId', id)
        .single();

      return {
        profile: data,
        error,
      };
    };
    const getUser = async () => {
      const data = await queryClient.fetchQuery({
        queryKey: ['profile', id],
        queryFn: getProfile,
      });
      // @ts-ignore
      setUser(data?.profile);
      setLoading(false);
    };

    getUser();
  }, []);

  const numberOfWorkspace = user?.workspace?.length || 0;
  if (isErrorConnections || isConnectionsPaused) {
    return <ErrorComponent refetch={refetchConnections} />;
  }
  if (loading || isPendingConnections) {
    return <LoadingComponent />;
  }
  const assignedWk = user?.workerId?.workspaceId ? 1 : 0;
  return (
    <View style={{ flex: 1 }}>
      <View style={defaultStyle}>
        <HeaderNav title="Profile" RightComponent={RightComponent} />
      </View>
      <TopCard
        id={user?.userId}
        name={user?.name}
        image={user?.avatar}
        ownedWks={numberOfWorkspace}
        assignedWk={assignedWk}
        workspaceId={user?.workerId?.id}
      />
      <View style={{ marginTop: 20, ...defaultStyle }}>
        <MiddleCard connections={connections?.connections} />
      </View>
      <View style={{ marginTop: 'auto', ...defaultStyle, marginBottom: 15 }}>
        <BottomCard workId={user?.workerId?.id} />
      </View>
    </View>
  );
};

export default MyProfile;

const RightComponent = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <Pressable
      onPress={toggleDarkMode}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        padding: 5,
        borderRadius: 5555,
        // backgroundColor: darkMode === 'dark' ? 'white' : 'black',
      })}
    >
      <IconButton
        icon={darkMode === 'dark' ? 'weather-sunny' : 'weather-night'}
        size={25}
        iconColor={darkMode === 'dark' ? 'black' : 'white'}
        containerColor={darkMode === 'dark' ? 'white' : 'black'}
      />
    </Pressable>
  );
};
