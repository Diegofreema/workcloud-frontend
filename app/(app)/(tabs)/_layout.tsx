import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, useColorScheme } from 'react-native';

import { colors } from '../../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { fontFamily } from '../../../constants';

import { useDarkMode } from '@/hooks/useDarkMode';
import { StatusBar } from '@gluestack-ui/themed';
import { useUnread } from '@/hooks/useUnread';
import { Badge } from '@rneui/themed';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  size?: number;
}) {
  return <FontAwesome style={{ marginBottom: -3 }} {...props} />;
}
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)/home',
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { darkMode } = useDarkMode();
  const { unread } = useUnread();

  return (
    <>
      <StatusBar
        barStyle={darkMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
      />

      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: darkMode === 'dark' ? '#151718' : 'white',
          headerShown: false,
          tabBarStyle: {
            height: 50,
            paddingBottom: 5,
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
          },
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="home"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.grayText,
                  fontFamily: fontFamily.Bold,
                  fontSize: 10,
                }}
              >
                Home
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ focused, size }) => (
              <View>
                <TabBarIcon
                  name="envelope"
                  color={focused ? colors.buttonBlue : colors.grayText}
                  size={size}
                />
                {unread > 0 && (
                  <Badge
                    containerStyle={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                    }}
                    value={`${unread}`}
                    status="success"
                  />
                )}
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.grayText,
                  fontFamily: fontFamily.Bold,
                  fontSize: 10,
                }}
              >
                Messages
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="organization"
          options={{
            title: 'Organizations',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="briefcase"
                color={focused ? colors.buttonBlue : colors.grayText}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.grayText,
                  fontFamily: fontFamily.Bold,
                  fontSize: 10,
                }}
              >
                Organizations
              </Text>
            ),
          }}
        />
        {/* <Tabs.Screen
          name="call/index"
          options={{
            title: 'Call logs',
            tabBarIcon: ({ focused, size }) => (
              <TabBarIcon
                name="phone"
                color={focused ? colors.buttonBlue : colors.gray}
                size={size}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  color: focused ? colors.buttonBlue : colors.gray,
                  fontFamily: fontFamily.Bold,
                  fontSize: 7,
                }}
              >
                Call logs
              </Text>
            ),
            href: null,
          }}
        /> */}
        {/* <Tabs.Screen
          name="call/videoCall"
          options={{
            href: null,
          }}
        /> */}
      </Tabs>
    </>
  );
}
