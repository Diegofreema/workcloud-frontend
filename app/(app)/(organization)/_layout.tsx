import { StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

const OrganizationLayout = (props: Props) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,

        marginTop: -30,
      }}
    >
      <Stack>
        <Stack.Screen name="organizations" options={{ headerShown: false }} />
        <Stack.Screen
          name="[organizationId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="edit/[editId]" options={{ headerShown: false }} />
        <Stack.Screen name="posts/[id]" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
};

export default OrganizationLayout;

const styles = StyleSheet.create({});
