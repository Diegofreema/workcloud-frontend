import { FlatList, StyleSheet } from 'react-native';

import { EmptyText } from '@/components/EmptyText';
import { Item } from '@/components/Item';
import { Container } from '@/components/Ui/Container';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { useAuth } from '@/hooks/useAuth';
import { Box } from '@gluestack-ui/themed';
import { useEffect } from 'react';
import { Header } from '../../../components/Header';
import { OrganizationModal } from '../../../components/OrganizationModal';
import { ProfileHeader } from '../../../components/ProfileHeader';
import { HeadingText } from '../../../components/Ui/HeadingText';
import { colors } from '../../../constants/Colors';
import { useOrganizationModal } from '../../../hooks/useOrganizationModal';
import { useGetConnection } from '../../../lib/queries';
import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function TabOneScreen() {
  const { isLoaded, isSignedIn } = useUser();
  const {
    data,
    isError,
    isPending,
    isPaused,
    refetch,
    error: errorAuth,
  } = useAuth();

  useEffect(() => {
    if (!data) return;
    if (!data?.organizationId && !data?.workerId) {
      onOpen();
    }
  }, [data?.organizationId, data?.workerId]);
  const {
    data: connections,
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,
    error,
    isPaused: isConnectionsPaused,
  } = useGetConnection(data?.userId || '');

  const { onOpen } = useOrganizationModal();
  const handleRefetch = () => {
    refetch();
    refetchConnections();
  };
  if (!isSignedIn) {
    return <Redirect href="/" />;
  }
  if (isError || isErrorConnections || isConnectionsPaused) {
    return <ErrorComponent refetch={refetch} />;
  }
  console.log(isPending, isPendingConnections);

  if (isPending || isPendingConnections) {
    return <LoadingComponent />;
  }

  const { connections: connectionsData } = connections;

  const firstTen = connectionsData?.slice(0, 10);

  return (
    <Container>
      <OrganizationModal />
      <Header />
      <ProfileHeader
        id={data?.userId!}
        avatar={data?.avatar!}
        name={data?.name!}
        email={data?.email!}
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
