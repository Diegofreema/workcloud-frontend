import React, { useCallback, useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useData } from '@/hooks/useData';
import { StatusBar } from '@gluestack-ui/themed';
import { useDarkMode } from '@/hooks/useDarkMode';

type Props = {};

const AuthLayout = (props: Props) => {
  const { getValues, id, user } = useData();
  const { darkMode } = useDarkMode();

  const getUserStored = useCallback(() => {
    getValues();
  }, []);
  useEffect(() => {
    getUserStored();
  }, []);

  if (id && user?.id) {
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
