import { HStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { MyText } from './Ui/MyText';
import { colors } from '@/constants/Colors';
import { format, formatDistanceToNow, isBefore, parse } from 'date-fns';
import { VStack } from '@gluestack-ui/themed';
import { useData } from '@/hooks/useData';
import { useChatContext } from 'stream-chat-expo';
import { useRouter } from 'expo-router';
import { Connection, ConnectionType } from '../constants/types';
import { checkLength } from '@/lib/helper';

export const Item = (item: Connection & { isLastItemOnList?: boolean }) => {
  const router = useRouter();

  const [hours, minutes] = item?.connectedTo?.end.split(':').map(Number);

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  const isOpen = isBefore(new Date(), date);

  const startChannel = async () => {
    router.push(`/reception/${item?.connectedTo?.id}`);
  };
  return (
    <Pressable
      //@ts-ignore
      onPress={startChannel}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.3 }]}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={7} alignItems="center">
          <Image
            source={{ uri: item?.connectedTo?.avatar }}
            style={{ width: 48, height: 48, borderRadius: 9999 }}
          />
          <VStack>
            <MyText poppins="Bold" fontSize={10}>
              {item?.connectedTo?.name}
            </MyText>
            {isOpen ? (
              <View
                style={{
                  backgroundColor: colors.openTextColor,
                  width: 45,
                  borderRadius: 9999,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MyText
                  poppins="Medium"
                  style={{ color: colors.openBackgroundColor }}
                  fontSize={10}
                >
                  Open
                </MyText>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.closeBackgroundColor,
                  width: 45,
                  borderRadius: 9999,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MyText
                  style={{ color: colors.closeTextColor }}
                  poppins="Medium"
                  fontSize={10}
                >
                  Closed
                </MyText>
              </View>
            )}
          </VStack>
        </HStack>
        <VStack>
          <MyText poppins="Light" fontSize={9}>
            Time
          </MyText>
          <MyText poppins="Light" fontSize={9}>
            {formatDistanceToNow(new Date(item?.created_at))} ago
          </MyText>
        </VStack>
      </HStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    marginBottom: 10,
    paddingBottom: 20,
  },
});
