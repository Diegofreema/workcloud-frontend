import { View, Text, Pressable } from 'react-native';
import { HStack, ScrollView, VStack } from '@gluestack-ui/themed';

import React from 'react';
import { defaultStyle } from '../../../constants/index';
import { HeaderNav } from '../../../components/HeaderNav';
import { MyText } from '../../../components/Ui/MyText';
import { Image } from 'expo-image';
import { colors } from '../../../constants/Colors';
import { StyleSheet } from 'react-native';
import { EvilIcons, Fontisto, Ionicons } from '@expo/vector-icons';
import { MyButton } from '../../../components/Ui/MyButton';
import { useRouter } from 'expo-router';
import { Container } from '@/components/Ui/Container';

type Props = {};

const Orgs = (props: Props) => {
  const router = useRouter();
  const handleNav = () => {
    router.push('/lobby');
  };
  return (
    <Container>
      <ScrollView style={{ flex: 1 }}>
        <HeaderNav title="Fidelity" subTitle="Banking and financial Services" />
        <View style={{ marginTop: 10 }}>
          <HStack gap={10} alignItems="center">
            <Image
              source={{ uri: 'https://via.placeholder.com/48x48' }}
              style={{ width: 48, height: 48, borderRadius: 9999 }}
            />

            <MyText poppins="Light" fontSize={9} style={{ flex: 1 }}>
              We provide outstanding Online, Personal Banking, SME Banking,
              Corporate, Investment, Agric and Private Banking Services.
            </MyText>
          </HStack>
          <View style={{ marginTop: 10 }}>
            <MyText
              poppins="Medium"
              style={{ color: colors.nine, marginBottom: 10 }}
            >
              Opening hours:
            </MyText>

            <HStack gap={20} mb={10}>
              <MyText poppins="Medium">Monday - Friday</MyText>
              <HStack>
                <View style={styles.subCon}>
                  <MyText
                    poppins="Bold"
                    style={{
                      color: colors.openBackgroundColor,
                    }}
                  >
                    8:00am
                  </MyText>
                </View>
                <Text> - </Text>
                <View
                  style={[
                    styles.subCon,
                    { backgroundColor: colors.closeBackgroundColor },
                  ]}
                >
                  <MyText
                    poppins="Bold"
                    style={{
                      color: colors.closeTextColor,
                    }}
                  >
                    5:00pm
                  </MyText>
                </View>
              </HStack>
            </HStack>

            <Details />
            <MyText poppins="Bold" style={{ marginTop: 10 }}>
              {' '}
              Members 1.2M
            </MyText>
            <HStack alignItems="center" gap={10} mt={20}>
              <MyButton
                onPress={handleNav}
                style={{ width: '50%' }}
                contentStyle={{ backgroundColor: colors.cod }}
                textColor={colors.dialPad}
              >
                Visit Workspace
              </MyButton>
              <MyButton
                style={{ width: '50%' }}
                contentStyle={{ backgroundColor: colors.dialPad }}
              >
                Join
              </MyButton>
            </HStack>
          </View>

          <ServicePoint />
        </View>
      </ScrollView>
    </Container>
  );
};

export default Orgs;

const styles = StyleSheet.create({
  subCon: {
    paddingHorizontal: 7,
    borderRadius: 3,
    backgroundColor: colors.openTextColor,
    alignItems: 'center',
  },
});

const Details = () => {
  return (
    <View style={{ marginTop: 10, gap: 10 }}>
      <HStack alignItems="center" gap={5}>
        <EvilIcons name="location" size={15} color={colors.nine} />
        <MyText poppins="Light" style={{ color: colors.nine }}>
          Lagos Nigeria
        </MyText>
      </HStack>
      <HStack alignItems="center" gap={5}>
        <Fontisto name="email" size={15} color={colors.nine} />
        <MyText poppins="Light" style={{ color: colors.nine }}>
          Fidelitybank@gmail.com
        </MyText>
      </HStack>
      <HStack alignItems="center" gap={5}>
        <Ionicons name="link-outline" size={15} color={colors.nine} />
        <MyText poppins="Light" style={{ color: colors.nine }}>
          www.fidelitybank.com
        </MyText>
      </HStack>
    </View>
  );
};

const data = [
  {
    title: 'Electronic cash tellering',
    subTitle: 'Remita, western union, world remit etc.',
  },
  {
    title: 'Customer service',
    subTitle:
      'Get connected to a representative and achieve more on workcloud banking.',
  },
  {
    title: 'Loan and funding',
    subTitle: 'Connect to a special advice on our loan and funding policy.',
  },
];

const ServicePoint = () => {
  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          backgroundColor: '#F2F2F2',
          borderRadius: 20,
          width: 90,
          alignItems: 'center',
        }}
      >
        <MyText
          poppins="Bold"
          style={{
            color: colors.black,
            padding: 5,
          }}
        >
          Service point
        </MyText>
      </View>
      <VStack mt={10} gap={25}>
        {data.map((item, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              { gap: 5, paddingBottom: 25 },
              {
                borderBottomColor: '#F2F2F2',
                borderBottomWidth: index !== 2 ? 2 : 0,
              },
            ]}
          >
            <MyText poppins="Medium" fontSize={14}>
              {item.title}
            </MyText>
            <MyText
              poppins="Light"
              style={{ color: colors.nine, fontSize: 10 }}
            >
              {item.subTitle}
            </MyText>
          </Pressable>
        ))}
      </VStack>
    </View>
  );
};
