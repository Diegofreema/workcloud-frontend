import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useDarkMode } from '../hooks/useDarkMode';

type Props = {
  children: React.ReactNode;
};

export const AuthTitle = ({ children }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Text
      variant="titleLarge"
      style={{
        fontFamily: 'PoppinsBold',
        fontSize: 20,
        maxWidth: 200,
        color: darkMode === 'dark' ? 'white' : 'black',
      }}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});
