import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Text } from 'react-native-paper';

import { PartialUser } from '../hooks/useData';
import { useDarkMode } from '@/hooks/useDarkMode';

export const ProfileHeader = (user: PartialUser): JSX.Element | undefined => {
  const { darkMode } = useDarkMode();
  return (
    <Link asChild href={`/(app)/(myProfile)/${user?.id}`}>
      <Pressable
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Image style={styles.image} source={user?.avatar} contentFit="cover" />
        <View>
          <Text
            variant="titleSmall"
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 17,
              color: darkMode === 'dark' ? 'white' : 'black',
            }}
          >
            Hi {user?.name}
          </Text>
          <Text
            style={{
              color: '#666666',
              fontFamily: 'PoppinsLight',
            }}
          >
            Good to have you here
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
