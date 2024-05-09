import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useDarkMode } from '../../../hooks/useDarkMode';

type Props = {};

const organizations = (props: Props) => {
  const { darkMode } = useDarkMode();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: darkMode ? 'white' : 'black',
        }}
      >
        No organizations to join yet
      </Text>
    </View>
  );
};

export default organizations;

const styles = StyleSheet.create({});
