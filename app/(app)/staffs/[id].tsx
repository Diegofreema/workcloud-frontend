import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useGetMyStaffs, useGetPersonalWorkers } from '@/lib/queries';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { AuthHeader } from '@/components/AuthHeader';
import { MyText } from '@/components/Ui/MyText';
import { colors } from '@/constants/Colors';
import { Pressable } from 'react-native';
import { DottedButton } from '@/components/Ui/DottedButton';
import { WorkType, Workers } from '@/constants/types';
import { AddStaff, Menu } from '@/components/Dialogs/AddStaff';
import { useAddStaff } from '@/hooks/useAddStaff';
import { SelectNewRow } from '@/components/Dialogs/SelectNewRow';
import { HStack } from '@gluestack-ui/themed';
import { WorkerProfileArray } from '../../../constants/types';
import { UserPreview } from '@/components/Ui/UserPreview';
import { EmptyText } from '@/components/EmptyText';
import { useSelectNewRow } from '@/hooks/useSelectNewRow';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHandleStaff } from '@/hooks/useHandleStaffs';
import { RemoveUser } from '@/components/Dialogs/RemoveUser';
import { Container } from '@/components/Ui/Container';
import { useDarkMode } from '@/hooks/useDarkMode';

type Props = {};
const allRoles = [
  'All',
  'Customer service',
  'Sales Representative',
  'Account opening',
  'Logistics',
  'ICT',
];
const Staffs = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectId, setSelectId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { onOpen: onOpenSelectRowModal, onClose: onCloseSelectRow } =
    useSelectNewRow();
  const { getItem, item: staff } = useHandleStaff();

  const [role, setRole] = useState('All');
  const router = useRouter();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = useGetMyStaffs(id);
  const { darkMode } = useDarkMode();

  const workers = useMemo(() => {
    if (!data?.staffs) return [];
    if (role === 'All') {
      return data?.staffs;
    }

    return data?.staffs?.filter((worker) => worker.role === role);
  }, [data, role]);

  if (isError || isRefetchError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  const pendingStaffs = () => {
    router.push('/pending-staffs');
  };

  const showMenu = (item: WorkType) => {
    setIsVisible(true);
    getItem(item);
  };
  const { staffs } = data;
  console.log('🚀 ~ Staffs ~ wks:', staffs[0]);
  const array: { icon: any; text: string }[] = [
    {
      icon: 'user-o',
      text: 'View profile',
    },
    {
      icon: 'send-o',
      text: 'Send message',
    },

    {
      icon: staff?.workspaceId?.locked ? 'unlock-alt' : 'lock',
      text: staff?.workspaceId?.locked ? 'Unlock workspace' : 'Lock workspace',
    },
    {
      icon: 'trash-o',
      text: 'Remove staff',
    },
  ];
  return (
    <Container>
      <AddStaff />
      <RemoveUser />
      <Menu isVisible={isVisible} setIsVisible={setIsVisible} array={array} />
      <SelectNewRow id={id} />
      <AuthHeader path="Staffs" />
      <View style={{ marginBottom: 15 }}>
        <FlatList
          horizontal
          style={{ marginBottom: 10 }}
          showsHorizontalScrollIndicator={false}
          data={allRoles}
          contentContainerStyle={{ gap: 20 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.buttonStyle,
                pressed && { opacity: 0.5 },
                role === item && styles.activeButton,
              ]}
              onPress={() => setRole(item)}
            >
              <MyText
                style={{ color: role === item ? 'white' : 'black' }}
                poppins="Medium"
                fontSize={13}
              >
                {item}
              </MyText>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />
        <HStack gap={10}>
          <DottedButton text="Add New Staff" onPress={onOpenSelectRowModal} />
          <DottedButton
            isIcon={false}
            text="Pending Staffs"
            onPress={pendingStaffs}
          />
        </HStack>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        data={workers}
        renderItem={({ item }) => (
          <HStack justifyContent="space-between" alignItems="center">
            <UserPreview
              id={item?.id}
              imageUrl={item?.userId?.avatar}
              name={item?.userId?.name}
              subText={item?.role}
            />
            <Pressable
              onPress={() => showMenu(item)}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={darkMode === 'dark' ? 'white' : 'black'}
              />
            </Pressable>
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text={'No staffs found'} />}
      />
    </Container>
  );
};

export default Staffs;

type PropsBottom = {
  role: string;
  setRole: (role: string) => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  buttonStyle: {
    backgroundColor: colors.buttonSmall,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },

  activeButton: {
    backgroundColor: colors.dialPad,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
