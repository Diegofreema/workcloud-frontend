import { EvilIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { useDarkMode } from '../hooks/useDarkMode';
import { useRouter } from 'expo-router';
import { useThemeColor } from './Themed';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { usePendingRequest } from '@/lib/queries';
import { useAuth } from '@clerk/clerk-expo';

type Props = {};

export const Header = ({}: Props): JSX.Element => {
  const queryClient = useQueryClient();
  const { darkMode } = useDarkMode();
  const { userId: id } = useAuth();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
  } = usePendingRequest(id);
  useEffect(() => {
    const channel = supabase
      .channel('workcloud')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'requests',
        },
        (payload) => {
          // if (payload) {
          //   onRefresh(id);
          // }
          console.log('Change received!', payload);
          queryClient.invalidateQueries({ queryKey: ['pending_requests'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const router = useRouter();
  const onSearch = () => {
    router.push('/search');
  };
  const onNotify = () => {
    router.push('/notification');
  };
  const numberOfUnread = data?.requests.filter((r) => r.unread).length || 0;
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
            size={30}
            color={darkMode === 'dark' ? '#fff' : '#000'}
          />
        </Pressable>
        <Pressable
          onPress={onNotify}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <EvilIcons
            name="bell"
            size={30}
            color={darkMode === 'dark' ? '#fff' : '#000'}
          />
          {numberOfUnread > 0 && (
            <View style={styles.unread}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {numberOfUnread}
              </Text>
            </View>
          )}
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
  unread: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
