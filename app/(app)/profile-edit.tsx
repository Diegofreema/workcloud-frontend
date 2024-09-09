import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { MyButton } from '@/components/Ui/MyButton';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useGetConnection, useProfile } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { useDarkMode } from '@/hooks/useDarkMode';
import { IconButton } from 'react-native-paper';
import { HeaderNav } from '@/components/HeaderNav';
import { TopCard } from '@/components/LoggedInuser/TopCard';
import { defaultStyle } from '@/constants';
import { MiddleCard } from '@/components/LoggedInuser/MiddleCard';
import { BottomCard } from '@/components/LoggedInuser/BottomCard';

type Props = {};

const ProfileEdit = (props: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const { darkMode } = useDarkMode();
  const { data, isError, isPending, refetch } = useProfile(user?.id);
  const {
    data: connections,
    isError: isConnectionError,
    isPending: isPendingConnections,
    refetch: refetchConnections,
  } = useGetConnection(user?.id);
  console.log(connections);
  const handleRefetch = async () => {
    refetch();
    refetchConnections();
  };
  if (isError || isConnectionError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingConnections) {
    return <LoadingComponent />;
  }
  const assignedWk = data.profile?.workerId?.workspaceId ? 1 : 0;
  const numberOfWorkspace = data.profile?.workspace?.length || 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: darkMode === 'dark' ? 'black' : 'white' },
        ]}
      >
        <HeaderNav title="Profile" RightComponent={RightComponent} />
      </View>
      <TopCard
        id={data.profile?.userId}
        name={data.profile?.name}
        image={data.profile?.avatar}
        ownedWks={numberOfWorkspace}
        assignedWk={assignedWk}
        workspaceId={data.profile?.workerId?.id}
      />
      <View style={{ marginTop: 20, ...defaultStyle }}>
        <MiddleCard connections={connections?.connections} />
      </View>
      <View style={{ marginTop: 'auto', ...defaultStyle, marginBottom: 15 }}>
        <BottomCard workId={data.profile?.workerId?.id} />
      </View>
    </View>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
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
