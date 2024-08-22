import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { ComponentType, useEffect } from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { useRouter } from 'expo-router';
import { TextComponents } from '../../../components/TextComponents';
import { defaultStyle } from '../../../constants/index';
import {
  ChannelAvatar,
  ChannelList,
  ChannelPreview,
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
  EmptyStateProps,
} from 'stream-chat-expo';
import { MyText } from '@/components/Ui/MyText';

import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { HStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { colors } from '@/constants/Colors';
import { useData } from '@/hooks/useData';
import { useUnread } from '@/hooks/useUnread';

type Props = {};

const messages = (props: Props) => {
  const { id: userId } = useData();
  const { darkMode } = useDarkMode();
  const router = useRouter();
  const onSelect = (id: any) => {
    router.push(`/chat/${id}`);
  };

  console.log(userId);

  return (
    <View
      style={{
        flex: 1,
        ...defaultStyle,
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      }}
    >
      <ChannelList
        additionalFlatListProps={{
          style: {
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
          },
          contentContainerStyle: {
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
          },
        }}
        filters={{ members: { $in: [userId] } }}
        onSelect={(channel) => onSelect(channel.id)}
        EmptyStateIndicator={EmptyComponent}
        HeaderErrorIndicator={ErrorComponent}
        Preview={Preview}
        numberOfSkeletons={20}
      />
    </View>
  );
};

export default messages;

const styles = StyleSheet.create({});

const List = () => {
  return null;
};

const EmptyComponent = ({ listType }: EmptyStateProps) => {
  const { darkMode } = useDarkMode();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      }}
    >
      <MyText poppins="Bold" fontSize={20}>
        No messages yet
      </MyText>
    </View>
  );
};
const ErrorComponent = () => {
  return (
    <View>
      <MyText poppins="Bold" fontSize={15}>
        There was an error loading this chat
      </MyText>
    </View>
  );
};

const Preview = (props: ChannelPreviewMessengerProps) => {
  const { unread, PreviewAvatar, latestMessagePreview } = props;
  const { getUnread } = useUnread();
  const { darkMode } = useDarkMode();
  useEffect(() => {
    getUnread(unread || 0);
  }, [unread]);

  const backgroundColor = unread ? colors.dialPad : 'transparent';
  return (
    <View style={{ backgroundColor: backgroundColor }}>
      <ChannelPreview
        {...props}
        Preview={(items) => (
          <ChannelPreviewMessenger
            {...items}
            PreviewTitle={items?.PreviewTitle}
          />
        )}
      />
    </View>
  );
};
