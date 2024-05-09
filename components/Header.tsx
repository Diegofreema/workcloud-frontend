import { EvilIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useDarkMode } from '../hooks/useDarkMode';
import { useRouter } from 'expo-router';
import { useThemeColor } from './Themed';

type Props = {};

export const Header = ({}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();

  const router = useRouter();
  const onSearch = () => {
    router.push('/search');
  };
  const onNotify = () => {
    router.push('/notification');
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: 'PoppinsBoldItalic',
          color: colors.buttonBlue,
          fontSize: 15,
        }}
      >
        Workcloud
      </Text>
      <View style={styles.subContainer}>
        <Pressable
          onPress={onSearch}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1, paddingHorizontal: 5 },
          ]}
        >
          <EvilIcons
            name="search"
            size={28}
            color={darkMode === 'dark' ? '#fff' : '#000'}
          />
        </Pressable>
        <Pressable
          onPress={onNotify}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <EvilIcons
            name="bell"
            size={28}
            color={darkMode === 'dark' ? '#fff' : '#000'}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    gap: 20,
  },
});
