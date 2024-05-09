import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useDarkMode } from '../../hooks/useDarkMode';
import { View } from '../Themed';
import { Box } from '@gluestack-ui/themed';

type Props = {
  children: React.ReactNode;
  flex?: number;
};

export const Container = ({ children, flex }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Box
      bg={darkMode === 'dark' ? 'black' : 'white'}
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}
    >
      {children}
    </Box>
  );
};

const styles = StyleSheet.create({});
