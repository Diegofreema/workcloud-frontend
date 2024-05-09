import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDetailsToAdd } from '@/hooks/useDetailsToAdd';
import { AuthHeader } from '@/components/AuthHeader';
import { HeaderNav } from '@/components/HeaderNav';
import { Button } from 'react-native-paper';
import { EvilIcons } from '@expo/vector-icons';
import { useGetOtherWorkers, usePendingWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { WorkType, Workers } from '@/constants/types';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { MyText } from '@/components/Ui/MyText';
import { useRouter } from 'expo-router';
import { UserPreview } from '@/components/Ui/UserPreview';
import { EmptyText } from '@/components/EmptyText';
import { useData } from '@/hooks/useData';
import { Container } from '@/components/Ui/Container';
import { useDarkMode } from '@/hooks/useDarkMode';

type Props = {};

const AllStaffs = (props: Props) => {
  const { workspaceId, role } = useDetailsToAdd();
  const { id: userId } = useData();
  const [staffs, setStaffs] = useState<Workers[]>();

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
