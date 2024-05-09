import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { HeaderNav } from '../../components/HeaderNav';
import { defaultStyle } from '../../constants/index';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Organization } from '../../components/organization/Organization';
import { useGetConnection } from '@/lib/queries';
import { useData } from '@/hooks/useData';
import { ErrorComponent } from '@/components/Ui/ErrorComponent';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { EmptyText } from '@/components/EmptyText';
import { Item } from '@/components/Item';

type Props = {};

const connections = (props: Props) => {
  const { darkMode } = useDarkMode();
  const { user } = useData();
  const {
    data: connections,
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
    isError: isErrorConnections,
    isPending: isPendingConnections,
    error,
    isPaused: isConnectionsPaused,
  } = useGetConnection(user?.id);
  if (isErrorConnections || isConnectionsPaused) {
    return <ErrorComponent refetch={refetchConnections} />;
  }

  if (isPendingConnections) {
    return <LoadingComponent />;
  }
  const renderItem = ({ item, index }: { item: number; index: number }) => {
    const arr = [1, 2, 3, 4];
    const lastIndex = arr.length - 1;
    const isLastItemOnList = arr[lastIndex];
    console.log('🚀 ~ connections ~ isLastItemOnList:', isLastItemOnList);
    const isLastItem = index === lastIndex;
    return <Organization isLastItem={isLastItem} />;
  };
  const { connections: allConnections } = connections;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
        ...defaultStyle,
      }}
    >
      <HeaderNav title="All Connections" RightComponent={SearchComponent} />
      <FlatList
        onRefresh={refetchConnections}
        refreshing={isRefetchingConnections}
        contentContainerStyle={{
          gap: 15,
          paddingBottom: 50,
        }}
        data={allConnections}
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
    </View>
  );
};

const SearchComponent = () => {
  const { darkMode } = useDarkMode();
  return (
    <EvilIcons
      name="search"
      color={darkMode === 'dark' ? 'white' : 'black'}
      size={24}
    />
  );
};
export default connections;

const styles = StyleSheet.create({});
