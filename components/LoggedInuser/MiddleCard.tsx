import { FlatList, Pressable, View } from 'react-native';
import { HeadingText } from '../Ui/HeadingText';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ConnectionType } from '@/constants/types';
import { useData } from '@/hooks/useData';
import { Avatar } from 'react-native-paper';

const fourItems = [1, 2, 3, 4];
export const MiddleCard = ({
  connections,
}: {
  connections: ConnectionType[];
}): JSX.Element => {
  const firstSix = (connections?.length && connections?.slice(0, 6)) || [];
  return (
    <View>
      {connections?.length > 0 && (
        <>
          <HeadingText link="/connections" />
          <View style={{ marginTop: 10 }} />
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              gap: 15,
            }}
            data={firstSix}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return <Images item={item} />;
            }}
            showsVerticalScrollIndicator={false}
            ListFooterComponentStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </>
      )}
    </View>
  );
};

const Images = ({ item }: { item: ConnectionType }) => {
  const router = useRouter();
  const startChannel = async () => {
    router.push(`/reception/${item?.connectedTo?.id}`);
  };
  return (
    <Pressable onPress={startChannel}>
      <Avatar.Image size={50} source={{ uri: item?.connectedTo?.avatar }} />
    </Pressable>
  );
};
