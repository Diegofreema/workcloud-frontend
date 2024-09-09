import { MyText } from '@/components/Ui/MyText';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  ChannelList,
  ChannelPreview,
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
  EmptyStateProps,
} from 'stream-chat-expo';
import { defaultStyle } from '../../../constants/index';
import { useDarkMode } from '../../../hooks/useDarkMode';

import { colors } from '@/constants/Colors';
import { useData } from '@/hooks/useData';
import { useUnread } from '@/hooks/useUnread';
import { useAuth } from '@clerk/clerk-expo';

type Props = {};

const messages = (props: Props) => {
  const { userId } = useAuth();
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
        filters={{ members: { $in: [userId!] } }}
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
  const { height } = useWindowDimensions();
  return (
    <View
      style={{
        height: height * 0.8,
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

  const backgroundColor = unread ? colors.gray : 'transparent';
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
