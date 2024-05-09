import { View, Text, Image } from 'react-native';
import React from 'react';
import { Container } from '../../components/Ui/Container';
import { HeaderNav } from '../../components/HeaderNav';
import { HStack } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { MyText } from '../../components/Ui/MyText';
import { colors } from '../../constants/Colors';
import { StyleSheet, FlatList } from 'react-native';
import { MyButton } from '../../components/Ui/MyButton';
import { fontFamily } from '../../constants';

const lobbyData = {
  name: 'Clara Kalu',
  time: '4mins',
};

const newArray = new Array(20).fill('');
const lobby = () => {
  return (
    <Container flex={1}>
      <HeaderNav title="Fidelity" subTitle="Banking and financial Services" />

      <FlatList
        ListHeaderComponent={HeaderComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingBottom: 50 }}
        data={newArray}
        renderItem={({ item }) => (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={{ uri: 'https://via.placeholder.com/48x48' }}
              style={{ width: 48, height: 48, borderRadius: 9999 }}
            />
            <MyText poppins="Bold">{lobbyData.name}</MyText>
            <MyText poppins="Light">{lobbyData.time}</MyText>
          </View>
        )}
        numColumns={4}
        keyExtractor={(item, index) => Math.random().toString()}
        columnWrapperStyle={{ gap: 10 }}
      />
      <View style={styles.buttonContainer}>
        <MyButton
          onPress={() => {}}
          buttonColor={colors.dialPad}
          textColor="white"
          contentStyle={styles.btn}
          labelStyle={styles.btnText}
        >
          Exit Lobby
        </MyButton>
      </View>
    </Container>
  );
};

export default lobby;

const styles = StyleSheet.create({
  rounded: {
    backgroundColor: colors.dialPad,
    borderRadius: 20,
    width: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: 'white',
    height: 70,
  },
  btn: {
    height: 50,
  },
  btnText: { fontSize: 15, fontFamily: fontFamily.Bold },
});

const HeaderComponent = () => {
  return (
    <VStack>
      <HStack gap={5}>
        <Image
          source={{ uri: 'https://via.placeholder.com/48x48' }}
          style={{ width: 48, height: 48, borderRadius: 9999 }}
        />
        <VStack>
          <MyText poppins="Medium">Reps</MyText>
          <MyText poppins="Bold">Clara Kalu</MyText>
          <MyText poppins="Light">Help service</MyText>
        </VStack>
      </HStack>
      <VStack mt={20} gap={10}>
        <MyText poppins="Bold" fontSize={12}>
          Live interaction
        </MyText>
        <HStack gap={20}>
          <VStack>
            <Image
              source={{ uri: 'https://via.placeholder.com/48x48' }}
              style={{ width: 48, height: 48, borderRadius: 9999 }}
            />
            <MyText poppins="Light">Attending to</MyText>
            <MyText poppins="Bold">Clara Kalu</MyText>
          </VStack>
          <VStack>
            <Image
              source={{ uri: 'https://via.placeholder.com/48x48' }}
              style={{ width: 48, height: 48, borderRadius: 9999 }}
            />
            <MyText poppins="Light">Next</MyText>
            <MyText poppins="Bold">Clara Kalu</MyText>
          </VStack>
        </HStack>
      </VStack>
      <HStack alignItems="baseline">
        <MyText poppins="Bold" fontSize={12} style={{ marginTop: 20 }}>
          Waiting in the lobby
        </MyText>
        <View style={styles.rounded}>
          <MyText
            poppins="Bold"
            style={{
              color: 'white',
            }}
          >
            25
          </MyText>
        </View>
      </HStack>
    </VStack>
  );
};
