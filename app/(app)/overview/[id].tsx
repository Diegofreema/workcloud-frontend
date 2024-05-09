import { Pressable, Image, View, ScrollView } from 'react-native';
import React from 'react';
import { Container } from '../../../components/Ui/Container';
import { HeaderNav } from '../../../components/HeaderNav';
import { Feather } from '@expo/vector-icons';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { colors } from '../../../constants/Colors';
import { HStack, VStack } from '@gluestack-ui/themed';
import { MyText } from '../../../components/Ui/MyText';
import { OpeningHours } from '../../../components/OpeningHours';
import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useGetPosts } from '@/lib/queries';

type Props = {};

const data = {
  role: 'Customer Service',
  status: 'Active',
};

const array = Array.from({ length: 10 }, (_, i) => i + 1);
const Overview = (props: Props) => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Container>
        <HeaderNav
          title="Fidelity"
          subTitle="Banking and financial Services"
          RightComponent={RightComponent}
        />
        <TopHeader />
      </Container>
      <View
        style={{
          marginLeft: 10,

          marginBottom: -30,
        }}
      >
        <Image
          style={styles.image}
          source={require('../../../assets/images/instruction.png')}
          resizeMode="contain"
        />
      </View>
      <Container>
        <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={10}>
          Representatives
        </MyText>
        <HStack style={styles.container} justifyContent="flex-start">
          {array.map((item, index) => (
            <Representatives key={index} />
          ))}
        </HStack>
        <MyText poppins="Bold" style={{ marginVertical: 10 }} fontSize={10}>
          Featured
        </MyText>
        <View>
          <VStack alignItems="flex-start">
            <MyText poppins="Medium" fontSize={12}>
              Fidelity bank Dubai
            </MyText>
            <View
              style={{
                backgroundColor: colors.openTextColor,
                paddingHorizontal: 5,
                borderRadius: 9999,
              }}
            >
              <MyText
                poppins="Bold"
                fontSize={10}
                style={{ color: colors.openBackgroundColor }}
              >
                {'open'}
              </MyText>
            </View>
          </VStack>
        </View>
      </Container>
    </ScrollView>
  );
};

export default Overview;

const RightComponent = () => {
  const { darkMode } = useDarkMode();
  return (
    <Pressable onPress={() => router.push(`/orgs/${6}`)}>
      <Feather
        name="user"
        size={24}
        color={darkMode ? 'white' : colors.grayText}
      />
    </Pressable>
  );
};

const TopHeader = () => {
  return (
    <HStack gap={10} alignItems="center">
      <Image
        source={{ uri: 'https://via.placeholder.com/48x48' }}
        style={{ width: 48, height: 48, borderRadius: 9999 }}
      />
      <VStack>
        <MyText poppins="Light">Opening hours</MyText>
        <OpeningHours />
      </VStack>
    </HStack>
  );
};
const Representatives = () => {
  return (
    <VStack width={'25%'} alignItems="center" style={{ marginBottom: 15 }}>
      <Image
        source={{ uri: 'https://via.placeholder.com/48x48' }}
        style={{ width: 48, height: 48, borderRadius: 9999 }}
      />
      <MyText poppins="Bold" fontSize={10} style={{ verticalAlign: 'middle' }}>
        {data.role}
      </MyText>
      <View
        style={{
          backgroundColor: colors.openTextColor,
          paddingHorizontal: 5,
          borderRadius: 9999,
        }}
      >
        <MyText
          poppins="Bold"
          fontSize={10}
          style={{ color: colors.openBackgroundColor }}
        >
          {data.status}
        </MyText>
      </View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
  },
  container: { flexWrap: 'wrap' },
});
