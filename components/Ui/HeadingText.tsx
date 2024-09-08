import { HStack } from '@gluestack-ui/themed';
import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../constants/Colors';
import { MyText } from './MyText';
type Props = {
  link: any;
  leftText?: string;
  rightText?: string;
};

export const HeadingText = ({
  leftText = 'Connections',
  rightText = 'See all connections',
  link,
}: Props): JSX.Element => {
  return (
    <HStack alignItems="center" justifyContent="space-between">
      <MyText poppins="Bold" style={{ fontSize: RFValue(13) }}>
        {leftText}
      </MyText>
      <Link href={link}>
        <Text
          style={{
            color: colors.dialPad,
            fontSize: RFValue(9),
            fontFamily: 'PoppinsBold',
          }}
        >
          {rightText}
        </Text>
      </Link>
    </HStack>
  );
};

const styles = StyleSheet.create({});
