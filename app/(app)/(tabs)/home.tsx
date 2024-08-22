import { FlatList, StyleSheet } from 'react-native';

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
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useData } from '@/hooks/useData';
import { Profile } from '../../../constants/types';
import { EmptyText } from '@/components/EmptyText';
import { Item } from '@/components/Item';
import { supabase } from '@/lib/supabase';
import { Container } from '@/components/Ui/Container';
import { Box } from '@gluestack-ui/themed';

const queryClient = new QueryClient();

const getFn = async (id: string) => {
  try {
    const getProfile = async () => {
      const { data, error } = await supabase
        .from('user')
        .select(
          `name, avatar, streamToken, email, userId, organizationId (*), workerId (*)`
        )
        .eq('userId', id)
        .single();

      return data;
    };
    const res = await queryClient.fetchQuery({
      queryKey: ['profile', id],
      queryFn: getProfile,
    });
    console.log(res);

    return res;
  } catch (error) {
    return {};
  }
};
export default function TabOneScreen() {
  const { id, user } = useData();

  // const { data, isError, isPending, isPaused, refetch } = useProfile(id);
  const [profile, setProfile] = useState<Profile | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    const getData = async () => {
      const data = await getFn(id);
      // @ts-ignore
      setProfile(data);
    };

    getData();
  }, [id]);
  useEffect(() => {
    if (!profile) return;
    if (!profile?.organizationId?.id && !profile?.workerId?.id) {
      onOpen();
    }
  }, [profile?.organizationId?.id, profile?.workerId?.id]);
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
  const handleRefetch = async () => {
    refetchConnections();
    const data = await getFn(id);
    // @ts-ignore
    setProfile(data);
  };

  if (isErrorConnections || isConnectionsPaused) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (!profile?.userId || isPendingConnections) {
    return <LoadingComponent />;
  }

  const { connections: connectionsData } = connections;

  const firstTen = connectionsData?.slice(0, 10);
  // const { profile } = data;

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
