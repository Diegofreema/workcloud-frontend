import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChat } from 'stream-chat';
import { Chat, DeepPartial, OverlayProvider, Theme } from 'stream-chat-expo';
import { useCallback, useEffect } from 'react';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { useData } from '@/hooks/useData';

import { useChatClient } from '@/useChatClient';
import { AppProvider } from '@/AppContext';
import { useDarkMode } from '@/hooks/useDarkMode';
import { StatusBar } from '@gluestack-ui/themed';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { onRefresh } from '@/lib/helper';

const api = 'cnvc46pm8uq9';
const client = StreamChat.getInstance('cnvc46pm8uq9');

export default function AppLayout() {
  const { clientIsReady } = useChatClient();
  const { id, getValues, user } = useData();
  const { darkMode } = useDarkMode();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('workcloud')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          if (payload) {
            onRefresh(id);
          }
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const chatTheme: DeepPartial<Theme> = {
    channel: {
      selectChannel: {
        color: darkMode === 'dark' ? 'white' : 'black',
      },
    },
    channelListSkeleton: {
      container: {
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      },
      background: {
        backgroundColor: darkMode === 'dark' ? 'white' : 'black',
      },
    },

    channelPreview: {
      container: {
        backgroundColor: 'transparent',
      },
      title: {
        fontFamily: 'PoppinsBold',
        fontSize: 13,
        color: darkMode === 'dark' ? 'white' : 'black',
      },
      message: {
        fontFamily: 'PoppinsMedium',
        fontSize: 10,
        color: darkMode === 'dark' ? 'white' : 'black',
      },
    },

    overlay: {
      container: {
        backgroundColor: darkMode === 'dark' ? 'black' : 'white',
      },
    },
  };

  const getUserStored = useCallback(() => {
    getValues();
  }, []);

  useEffect(() => {
    getUserStored();
  }, []);

  if (!id || !user?.id) {
    return <Redirect href={'/'} />;
  }
  if (!clientIsReady) {
    return <LoadingComponent />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle={darkMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
      />
      {/* <StreamVideo client={clientVideo}> */}
      <AppProvider>
        <OverlayProvider value={{ style: chatTheme }}>
          <Chat client={client}>
            <Stack
              screenOptions={{ headerShown: false }}
              initialRouteName="(tabs)"
            />
          </Chat>
        </OverlayProvider>
      </AppProvider>
      {/* </StreamVideo> */}
    </GestureHandlerRootView>
  );
}
