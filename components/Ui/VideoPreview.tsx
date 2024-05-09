import { VStack } from '@gluestack-ui/themed';
import { Image } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { MyText } from './MyText';
import { colors } from '../../constants/Colors';
import { call } from '../LoggedInuser/BottomCard';

type Props = typeof call;

export const VideoPreview = (call: Props): JSX.Element => {
  return (
    <VStack justifyContent="center" alignItems="center">
      <Image
        source={require('../../assets/images/video.png')}
        style={styles.image}
      />
      <MyText poppins="Bold">{call.name}</MyText>
      <MyText fontSize={7} poppins="Medium">
        {call.from}
      </MyText>
      <MyText style={{ color: colors.nine }} poppins="Light">
        {call.time}
      </MyText>
    </VStack>
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
