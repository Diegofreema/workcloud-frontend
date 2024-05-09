import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { HStack } from '@gluestack-ui/themed';

import { HeaderNav } from '../../../components/HeaderNav';
import { defaultStyle } from '../../../constants/index';
import { VideoPreview } from '../../../components/Ui/VideoPreview';
import { call } from '../../../components/LoggedInuser/BottomCard';

type Props = {};

const arr = Array.from({ length: 10 }, (_, i) => i + 1);

const Records = (props: Props) => {
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <HeaderNav
        title="All Video Records"
        RightComponent={() => (
          <EvilIcons name="search" size={24} color="black" />
        )}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <HStack
          justifyContent="space-between"
          style={{ flexWrap: 'wrap' }}
          gap={10}
        >
          {arr.map((_, i) => (
            <VideoPreview key={i} {...call} />
          ))}
        </HStack>
      </ScrollView>
    </View>
  );
};

export default Records;
