import { FlatList, StyleSheet } from 'react-native';

import { useRouter } from 'expo-router';
import { defaultStyle } from '../../../constants';
import { Header } from '../../../components/Header';
import { ProfileHeader } from '../../../components/ProfileHeader';
import { colors } from '../../../constants/Colors';
import { useGetConnection } from '../../../lib/queries';
import { useEffect, useState } from 'react';
import { useOrganizationModal } from '../../../hooks/useOrganizationModal';
import { OrganizationModal } from '../../../components/OrganizationModal';
import { HeadingText } from '../../../components/Ui/HeadingText';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { useQueryClient } from '@tanstack/react-query';
import { useData } from '@/hooks/useData';
import { Profile } from '../../../constants/types';
import { EmptyText } from '@/components/EmptyText';
import { Item } from '@/components/Item';
import { supabase } from '@/lib/supabase';
import { View } from '@/components/Themed';
import { Container } from '@/components/Ui/Container';
import { Box } from '@gluestack-ui/themed';

export default function TabOneScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { id } = useData();

  const queryClient = useQueryClient();

  useEffect(() => {
    const getFn = async () => {
      try {
        const getProfile = async () => {
          const { data, error } = await supabase
            .from('user')
            .select(
              `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
            )
            .eq('userId', id)
            .single();
          // @ts-ignore
          setProfile(data);
          return data;
        };
        const res = await queryClient.fetchQuery({
          queryKey: ['profile', id],
          queryFn: getProfile,
        });

        return res;
      } catch (error) {
        console.log(error);
        return {};
      }
    };
    getFn();
  }, [id]);
  useEffect(() => {
    if (!profile) return;
    if (!profile?.organizationId?.id && !profile?.workerId?.id) {
      onOpen();
    }
  }, [profile]);
  const {
    data: connections,
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,
    error,
    isPaused: isConnectionsPaused,
  } = useGetConnection(id);

  const { onOpen } = useOrganizationModal();
  const handleRefetch = () => {
    refetchConnections();
  };

  if (isErrorConnections || isConnectionsPaused) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPendingConnections) {
    return <LoadingComponent />;
  }

  const { connections: connectionsData } = connections;
  if (!profile) {
    return <LoadingComponent />;
  }

  const firstTen = connectionsData.slice(0, 10);

  return (
    <Container>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={profile?.userId}
        avatar={profile?.avatar}
        name={profile?.name}
        email={profile?.email}
      />

      <Box style={{ marginVertical: 10 }}>
        <HeadingText link="/connections" />
      </Box>

      <FlatList
        onRefresh={handleRefetch}
        refreshing={isRefetchingConnections}
        contentContainerStyle={{
          gap: 15,
          paddingBottom: 50,
        }}
        data={firstTen}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const lastIndex = [1, 2, 3].length - 1;
          const isLastItemOnList = index === lastIndex;
          return <Item {...item} isLastItemOnList={isLastItemOnList} />;
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <EmptyText text="No Connections yet" />;
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
    paddingBottom: 20,
    borderColor: colors.gray,
  },
});
