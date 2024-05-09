import { HStack } from '@gluestack-ui/themed';
import { StyleSheet, View, Text } from 'react-native';
import { MyText } from './Ui/MyText';
import { colors } from '../constants/Colors';

type Props = {};

export const OpeningHours = ({}: Props): JSX.Element => {
  return (
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
  );
};

const styles = StyleSheet.create({
  subCon: {
    paddingHorizontal: 7,
    borderRadius: 3,
    backgroundColor: colors.openTextColor,
    alignItems: 'center',
  },
});
