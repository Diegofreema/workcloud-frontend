import { AuthTitle } from '@/components/AuthTitle';
import { MyButton } from '@/components/Ui/MyButton';
import { useDarkMode } from '@/hooks/useDarkMode';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Subtitle } from '@/components/Subtitle';
import { useWarmUpBrowser } from '@/hooks/warmUpBrowser';
import { useOAuth, useSignIn, useSignUp, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-paper';
import { LoadingComponent } from '@/components/Ui/LoadingComponent';

export default function SignInScreen() {
  useWarmUpBrowser();
  const { height } = useWindowDimensions();

  const { signUp, setActive, isLoaded } = useSignUp();
  const { signIn } = useSignIn();

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  const onSelectAuth = async () => {
    if (!signIn || !signUp) return;

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code ===
        'external_account_exists';

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    }

    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === 'transferable';

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
      try {
        const { createdSessionId, setActive } = await startOAuthFlow();
        if (createdSessionId) {
          setActive!({ session: createdSessionId });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (!isLoaded) {
    return <LoadingComponent />;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={{ marginTop: 40, marginHorizontal: 20 }}>
          <AuthTitle>Get an organized way to solve problems</AuthTitle>
          <Subtitle style={{ textAlign: 'center' }}>
            Own a workspace, connect to clients and get issue solved
          </Subtitle>
        </View>
        <Divider />
        <View
          style={{
            width: '100%',
            marginHorizontal: 10,
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Image
            source={require('@/assets/images/d.png')}
            style={{
              height: '100%',
              width: '80%',
              resizeMode: 'contain',
              marginTop: 20,
            }}
          />
        </View>
      </View>

      <LinearGradient
        colors={['#fff', 'rgba(255, 255,255, 1)', 'rgba(255, 255,255, 0.8)']}
        locations={[1, 0.5, 0]}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',

          height: height * 0.25,
        }}
      >
        <MyButton
          contentStyle={{ height: 50, borderRadius: 10 }}
          style={{
            height: 50,
            marginTop: 'auto',
            marginBottom: 50,
            marginHorizontal: 40,
          }}
          onPress={onSelectAuth}
        >
          <Text
            style={{
              fontFamily: 'PoppinsMedium',
              color: 'white',
              fontSize: 15,
            }}
          >
            Sign in with{' '}
          </Text>
          <FontAwesome name="google" size={20} color="white" />
          <Text
            style={{
              fontFamily: 'PoppinsMedium',
              color: 'white',
              fontSize: 15,
            }}
          >
            oogle
          </Text>
        </MyButton>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    gap: 10,
  },
});
