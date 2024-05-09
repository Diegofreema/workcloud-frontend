import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { usePendingWorkers } from '@/lib/queries';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { UserPreview } from '@/components/Ui/UserPreview';
import { MyText } from '@/components/Ui/MyText';
import { EmptyText } from '@/components/EmptyText';
import { useData } from '@/hooks/useData';

type Props = {};

const PendingStaffs = (props: Props) => {
  const { id } = useData();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = usePendingWorkers(id);
  console.log('🚀 ~ PendingStaffs ~ data:', data?.requests);
  if (isError || isRefetchError || isPaused || data?.error) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  console.log(data);

  return (
    <Container>
      <HeaderNav title="Pending Staffs" />
      <FlatList
        style={{ marginTop: 10 }}
        ListEmptyComponent={() => <EmptyText text="No pending staffs" />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={data?.requests}
        renderItem={({ item }) => (
          <UserPreview
            imageUrl={item?.to?.avatar}
            name={item?.to?.name}
            navigate
            subText={item?.pending}
            id={item?.to?.userId}
          />
        )}
        keyExtractor={(item) => item?.id.toString()}
      />
    </Container>
  );
};

export default PendingStaffs;

const styles = StyleSheet.create({});
