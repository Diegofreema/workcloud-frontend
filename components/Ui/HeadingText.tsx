import { HStack } from '@gluestack-ui/themed';
import { StyleSheet, View, Text } from 'react-native';
import { MyText } from './MyText';
import { colors } from '../../constants/Colors';
import { Link, LinkProps } from 'expo-router';

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
      <MyText poppins="Bold" style={{ fontSize: 13 }}>
        {leftText}
      </MyText>
      <Link href={link}>
        <Text
          style={{
            color: colors.dialPad,
            fontSize: 9,
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
