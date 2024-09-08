import { LoadingComponent } from '@/components/Ui/LoadingComponent';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useUser } from '@clerk/clerk-expo';
import { StatusBar } from '@gluestack-ui/themed';
import { Redirect, Stack } from 'expo-router';

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { darkMode } = useDarkMode();

  if (!isLoaded) {
    return <LoadingComponent />;
  }

  if (isSignedIn) {
    return <Redirect href={'/home'} />;
  }

  return (
    <>
      <StatusBar
        barStyle={darkMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;
