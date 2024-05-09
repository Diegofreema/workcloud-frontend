import { Image } from 'expo-image';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { colors } from '../constants/Colors';

type Props = {
  uri: string;
  name: string;
  darkMode: string;
  onPress: () => void;
};

export const WorkspaceDetails = ({
  uri,
  name,
  darkMode,
  onPress,
}: Props): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        { alignItems: 'center', gap: 5, minWidth: 70 },
      ]}
    >
      <Image source={uri} style={styles.image} />
      <Text
        style={{
          color: darkMode === 'dark' ? colors.white : colors.black,
          fontFamily: 'PoppinsBold',
          fontSize: 8,
        }}
      >
        {name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});
