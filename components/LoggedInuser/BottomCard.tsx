import { StyleSheet, ScrollView, Pressable, View } from 'react-native';
import { HStack, VStack } from '@gluestack-ui/themed';
import { Image } from 'expo-image';

import { HeadingText } from '../Ui/HeadingText';
import { router, useLocalSearchParams } from 'expo-router';
import { MyText } from '../Ui/MyText';
import { colors } from '../../constants/Colors';
import { VideoPreview } from '../Ui/VideoPreview';
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { useData } from '@/hooks/useData';
import { FontAwesome } from '@expo/vector-icons';
import { chatApiKey } from '@/chatConfig';
import { StreamChat } from 'stream-chat';

const chatClient = StreamChat.getInstance(chatApiKey);
type Props = {
  workId?: any;
};
export const call = {
  time: '20 min ago',
  from: 'Called on fidelity WS',
  name: 'Roland Gracias',
};

const fourItems = [1, 2, 3];
export const BottomCard = ({ workId }: Props): JSX.Element => {
  console.log('🚀 ~ BottomCard ~ workId:', workId);
  const { records } = useLocalSearchParams();
  const { removeId } = useData();

  const handleNavigate = () => {
    router.push('/settings');
  };

  const logout = () => {
    chatClient.disconnectUser();
    removeId();

    router.replace('/');
  };
  const onPress = () => {
    if (workId) {
      router.push(`/myWorkerProfile/${workId}`);
    } else {
      router.push('/create-worker-profile');
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack mt={20}>
        {/* <Pressable onPress={handleNavigate}>
          <HStack space="sm">
            <Image
              source={require('../../assets/images/settings.png')}
              style={{ width: 18, height: 18 }}
            />
            <VStack>
              <MyText poppins="Medium" fontSize={12}>
                Settings
              </MyText>
              <MyText poppins="Light" fontSize={9}>
                Change password, Email address
              </MyText>
            </VStack>
          </HStack>
        </Pressable> */}

        <Pressable
          onPress={logout}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <HStack space="sm" mt={20} alignItems="center">
            <Image
              source={require('../../assets/images/exit.png')}
              style={{ width: 25, height: 25 }}
            />
            <MyText poppins="Medium" fontSize={13}>
              Logout
            </MyText>
          </HStack>
        </Pressable>
        <View style={{ marginTop: 'auto' }}>
          <Pressable
            style={({ pressed }) => ({
              marginTop: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={onPress}
          >
            <FontAwesome name="user" size={24} color={colors.lightBlue} />
            <MyText poppins="Medium" fontSize={13}>
              {`${workId ? "Worker's" : "Create Worker's"} Profile`}
            </MyText>
          </Pressable>
        </View>
      </VStack>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
});
