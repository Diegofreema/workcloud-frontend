import { StyleSheet, Pressable } from 'react-native';
import { Organization } from '../constants/types';
import { Image } from 'expo-image';
import { MyText } from './Ui/MyText';

export const WorkspaceItem = ({
  item,
  onPress,
}: {
  item: Organization;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
    >
      <Image
        source={{ uri: item?.avatar }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'black',
        }}
        contentFit="cover"
      />
      <MyText
        poppins="Medium"
        style={{
          fontSize: 12,

          textTransform: 'capitalize',
        }}
      >
        {item?.name}
      </MyText>
    </Pressable>
  );
};

const styles = StyleSheet.create({});
