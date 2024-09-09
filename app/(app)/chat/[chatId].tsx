import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { MyText } from '@/components/Ui/MyText';
import { colors } from '@/constants/Colors';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useData } from '@/hooks/useData';
import { useGetWorkerProfile } from '@/lib/queries';
import { EvilIcons, Feather, FontAwesome } from '@expo/vector-icons';
import { HStack, VStack } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from 'react-native';
import { ActivityIndicator, Avatar } from 'react-native-paper';
import { Channel as ChannelType } from 'stream-chat';
import {
  AutoCompleteInput,
  Channel,
  FileAttachment,
  FileUploadPreview,
  Gallery,
  ImageUploadPreview,
  MessageInput,
  MessageList,
  useChatContext,
  useMessageContext,
  useMessageInputContext,
} from 'stream-chat-expo';

type Props = {};

const SingleChat = (props: Props) => {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { client } = useChatContext();
  const { darkMode } = useDarkMode();
  const [channel, setChannel] = useState<ChannelType>();

  useEffect(() => {
    const fetchChannel = async () => {
      const channel = await client.queryChannels({ id: { $eq: chatId } });
      setChannel(channel[0]);
    };
    fetchChannel();
  }, [chatId]);
  if (!channel) return <LoadingComponent />;
  return (
    <Channel
      // DateHeader={(date) => <DateHeader dateString={format(date, 'm')} />}
      MessageSimple={CustomMessage}
      Input={CustomInput}
      channel={channel}
    >
      <MessageList
        FooterComponent={CustomHeaderComponent}
        additionalFlatListProps={{
          contentContainerStyle: {
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
            flexGrow: 1,
          },
          style: {
            backgroundColor: darkMode === 'dark' ? 'white' : 'white',
          },

          ListFooterComponentStyle: {
            position: 'absolute',
            bottom: 5,
            zIndex: 5,
            left: 0,
            right: 0,
          },
        }}
      />
      <MessageInput />
    </Channel>
  );
};

export default SingleChat;

const CustomMessage = () => {
  const { message, isMyMessage } = useMessageContext();

  return message.text ? (
    <View
      style={{
        alignSelf: isMyMessage ? 'flex-end' : 'flex-start',
        backgroundColor: isMyMessage ? colors?.dialPad : '#DAE4FF',
        padding: 10,
        margin: 10,
        marginBottom: 5,
        borderRadius: 7,
        borderBottomRightRadius: isMyMessage ? 0 : 7,
        borderBottomLeftRadius: isMyMessage ? 7 : 0,
        width: '70%',
      }}
    >
      <Text
        style={{
          color: isMyMessage ? 'white' : 'black',
          fontFamily: 'PoppinsLight',
        }}
      >
        {message.text}
      </Text>
    </View>
  ) : (
    message?.attachments?.map((item, index) =>
      item.type === 'image' ? (
        <View
          key={index}
          style={{ alignSelf: isMyMessage ? 'flex-end' : 'flex-start' }}
        >
          {item.image_url && <Gallery />}
        </View>
      ) : (
        <FileAttachment
          key={index}
          attachment={item}
          attachmentSize={40}
          styles={{
            container: { alignSelf: isMyMessage ? 'flex-end' : 'flex-start' },
          }}
        />
      )
    )
  );
};

const CustomInput = () => {
  const { darkMode } = useDarkMode();
  const {
    sendMessage,
    text,
    toggleAttachmentPicker,
    imageUploads,
    fileUploads,
  } = useMessageInputContext();
  const isDisabled = !text && !imageUploads.length && !fileUploads.length;
  const additionalTextInputProps: TextInputProps = useMemo(() => {
    return {
      selectionColor: 'pink',
      style: {
        color: 'black',
        fontFamily: 'PoppinsLight',
        fontSize: 12,
        flex: 1,
      },
    };
  }, []);
  return (
    <View style={[styles.fullWidth]}>
      <ImageUploadPreview />
      <FileUploadPreview />
      <HStack gap={5}>
        <View style={[styles.fullWidth, styles.inputContainer, ,]}>
          <AutoCompleteInput
            additionalTextInputProps={additionalTextInputProps}
          />
          <Pressable
            // style={styles.send}
            onPress={toggleAttachmentPicker}
          >
            <EvilIcons name="image" size={30} color="#9E9E9E" />
          </Pressable>
        </View>
        <Pressable
          style={[styles.send, { opacity: isDisabled ? 0.5 : 1 }]}
          onPress={() => sendMessage()}
          disabled={isDisabled}
        >
          <Feather name="send" size={24} color="white" />
        </Pressable>
      </HStack>
    </View>
  );
};

const CustomHeaderComponent = () => {
  const { id } = useData();
  const { isOnline } = useChatContext();
  const { data, isPending, isError, isPaused } = useGetWorkerProfile(id);
  const { darkMode } = useDarkMode();

  const handleBack = () => {
    router.back();
  };
  if (isError || isPaused) {
    return (
      <HStack h={70} alignItems="center" px={15} mb={10}>
        <Pressable onPress={handleBack}>
          <FontAwesome
            name="angle-left"
            color={darkMode === 'dark' ? 'white' : 'black'}
            size={30}
          />
        </Pressable>
      </HStack>
    );
  }

  if (isPending) {
    return (
      <HStack
        h={70}
        alignItems="center"
        justifyContent="center"
        px={15}
        mb={10}
      >
        <ActivityIndicator color={darkMode === 'dark' ? 'white' : 'black'} />
      </HStack>
    );
  }

  const { worker } = data;

  return (
    <HStack h={70} px={15} mb={10} gap={10}>
      <Pressable onPress={handleBack}>
        <FontAwesome
          name="angle-left"
          color={darkMode === 'dark' ? 'white' : 'black'}
          size={30}
        />
      </Pressable>
      <HStack gap={6}>
        <Avatar.Image
          source={{ uri: worker?.organizationId?.avatar }}
          size={40}
        />
        <VStack>
          <MyText
            poppins={'Bold'}
            style={{ fontFamily: 'PoppinsBold', fontSize: 14 }}
          >
            {worker?.organizationId?.name}
          </MyText>
          <MyText
            poppins="Medium"
            style={{
              fontFamily: 'PoppinsMedium',

              fontSize: 8,
              color: isOnline
                ? colors.openBackgroundColor
                : colors.closeTextColor,
            }}
          >
            {isOnline ? 'Active' : 'Offline'}
          </MyText>
        </VStack>
      </HStack>
    </HStack>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  fullWidth: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    height: 40,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    padding: 5,
    flexDirection: 'row',
  },
  send: {
    backgroundColor: colors.dialPad,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 7,
  },
});
