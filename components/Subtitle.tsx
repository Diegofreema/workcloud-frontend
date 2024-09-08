import { StyleProp, StyleSheet, TextStyle, View } from 'react-native';

import { useDarkMode } from '../hooks/useDarkMode';
import { colors } from '../constants/Colors';
import { Text } from 'react-native-paper';
import { ViewStyle } from 'react-native-phone-input';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export const Subtitle = ({ children, style }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Text
      style={[
        {
          color: darkMode === 'dark' ? 'white' : colors.textGray,
          marginTop: 10,
          fontFamily: 'PoppinsLight',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});
