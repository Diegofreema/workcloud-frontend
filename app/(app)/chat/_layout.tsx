import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';

type Props = {};

const ChatLayout = () => {
  return (
    <Stack initialRouteName="chats" screenOptions={{ headerShown: false }} />
  );
};

export default ChatLayout;
