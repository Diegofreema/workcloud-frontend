import { FlatList } from 'react-native';
import React, { useState } from 'react';
import { usePendingRequest } from '@/lib/queries';
import { useData } from '@/hooks/useData';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { Container } from '@/components/Ui/Container';
import { HeaderNav } from '@/components/HeaderNav';
import { EmptyText } from '@/components/EmptyText';
import { WorkPreview } from '@/components/Ui/UserPreview';
import { Divider } from 'react-native-paper';
import { MyButton } from '@/components/Ui/MyButton';
import { checkIfEmployed } from '@/lib/helper';
import { MyModal } from '@/components/Dialogs/MyModal';
import { useQueryClient } from '@tanstack/react-query';
import { useInfos } from '@/hooks/useGetInfo';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';

type Props = {};

const Notification = (props: Props) => {
  const { user, id } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { infoIds, removeInfoIds } = useInfos();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = usePendingRequest(id);
  console.log(data?.error);

  if (isError || isRefetchError || isPaused || data?.error) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }
  // 6602c083d9c51008cb52b02c
  const { requests } = data;
  const handleTest = async () => {
    const data = await checkIfEmployed(id);
    console.log(data);
  };

  const onPress = async () => {
    setIsLoading(true);
    const { error } = await supabase
      .from('workspace')
      .update({
        workerId: null,
        locked: true,
        active: false,
        signedIn: false,
        leisure: false,
      })
      .eq('id', id);
    if (!error) {
    }

    // try {
    //   const { error } = await supabase
    //     .from('workspace')
    //     .update({
    //       salary: salary,
    //       responsibility: responsibility,
    //       workerId: to?.userId,
    //     })
    //     .eq('id', workspaceId);

    //   const { error: err } = await supabase
    //     .from('worker')
    //     .update({
    //       role: role,
    //       bossId: from?.userId,
    //       workspaceId: workspaceId,
    //       organizationId: from?.organizationId?.id,
    //     })
    //     .eq('id', to.workerId);
    //   if (!error && !err) {
    //     const { error } = await supabase
    //       .from('request')
    //       .delete()
    //       .eq('id', id);
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Request has been accepted',
    //     });

    //     router.push('/organization');
    //   }
    //   if (error || err) {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Something went wrong',
    //     });
    //     console.log(error || err);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Something went wrong',
    //   });
    // } finally {
    //   setAccepting(false);
    // }
  };

  return (
    <>
      <MyModal
        title="This means you are resigning from your previous position"
        onPress={onPress}
        isLoading={isLoading}
      />
      <Container>
        <HeaderNav title="Notifications" />
        <MyButton onPress={handleTest}>Test</MyButton>
        <FlatList
          style={{ marginTop: 10 }}
          ListEmptyComponent={() => (
            <EmptyText text="No pending notifications" />
          )}
          ItemSeparatorComponent={() => (
            <Divider
              style={{ height: 10, backgroundColor: '#ccc', width: '100%' }}
            />
          )}
          onRefresh={refetch}
          refreshing={isRefetching}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1,
          }}
          data={requests}
          renderItem={({ item }) => <WorkPreview item={item} />}
          keyExtractor={(item) => item?.id.toString()}
        />
      </Container>
    </>
  );
};

export default Notification;
