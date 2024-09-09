import { EmptyText } from '@/components/EmptyText';
import { HeaderNav } from '@/components/HeaderNav';
import { Container } from '@/components/Ui/Container';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import { Workers } from '@/constants/types';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useData } from '@/hooks/useData';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import { useGetOtherWorkers } from '@/lib/queries';
import { useAuth } from '@clerk/clerk-expo';
import { EvilIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Button } from 'react-native-paper';

type Props = {};

const AllStaffs = (props: Props) => {
  const { workspaceId, role } = useDetailsToAdd();
  const { userId } = useAuth();
  const [staffs, setStaffs] = useState<Workers[]>();
  console.log(role, 'role');

  const {
    data,
    isPending,
    isError,
    isPaused,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetOtherWorkers(userId);

  useEffect(() => {
    if (data?.worker) {
      const filteredData = data.worker.filter(
        (worker) => worker?.userId?.userId !== userId
      );
      setStaffs(filteredData);
    }
  }, [data]);

  // const {
  //   data: pendingData,
  //   isPending: isPendingData,
  //   isError: isErrorData,
  //   isPaused: isPausedData,
  //   refetch: refetchData,
  //   isRefetching: isRefetchingData,
  //   isRefetchError: isRefetchErrorData,
  // } = usePendingWorkers();

  const handleRefetch = () => {
    refetch();
  };
  if (isPaused || isError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const onRefreshing = isRefetching;

  return (
    <Container>
      <HeaderNav title="Add staff" />
      <FlatList
        onRefresh={handleRefetch}
        refreshing={onRefreshing}
        data={data.worker}
        renderItem={({ item }) => (
          <UserPreview
            id={item?.userId?.userId}
            imageUrl={item?.userId?.avatar}
            name={item?.userId?.name}
            subText={item?.location}
            navigate
          />
        )}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => <EmptyText text="No staff yet" />}
      />
    </Container>
  );
};

export default AllStaffs;

const RightComponent = () => {
  const { darkMode } = useDarkMode();
  return (
    <Button
      onPress={() => alert('search pressed')}
      style={{ marginRight: -15 }}
      rippleColor={'rgba(0, 0, 0, .32)'}
    >
      <EvilIcons
        name="search"
        size={24}
        color={darkMode === 'dark' ? 'white' : 'black'}
      />
    </Button>
  );
};
