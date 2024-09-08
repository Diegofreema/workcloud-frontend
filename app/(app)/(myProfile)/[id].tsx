import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { HeaderNav } from '../../../components/HeaderNav';
import { BottomCard } from '../../../components/LoggedInuser/BottomCard';
import { MiddleCard } from '../../../components/LoggedInuser/MiddleCard';
import { TopCard } from '../../../components/LoggedInuser/TopCard';
import { defaultStyle } from '../../../constants/index';

import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Profile } from '@/constants/types';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useGetConnection } from '@/lib/queries';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { IconButton } from 'react-native-paper';

const MyProfile = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { darkMode } = useDarkMode();
  const {
    data: connections,
    refetch: refetchConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,

    isPaused: isConnectionsPaused,
  } = useGetConnection(id);
  const [user, setUser] = useState<Profile | null>();

  const [loading, setLoading] = useState(false);

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
      <View
        style={[
          defaultStyle,
          { backgroundColor: darkMode === 'dark' ? 'black' : 'white' },
        ]}
      >
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
      {/* <View style={{ marginTop: 20, ...defaultStyle }}>
        <MiddleCard connections={connections?.connections} />
      </View> */}
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
