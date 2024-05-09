import { StyleSheet, StyleProp, TextStyle, Text } from 'react-native';
import { fontFamily } from '../../constants';
import { useDarkMode } from '../../hooks/useDarkMode';

type Props = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  poppins: 'Bold' | 'Light' | 'Medium' | 'BoldItalic' | 'LightItalic';
  fontSize?: number;
};

export const MyText = ({
  children,
  poppins,
  style,
  fontSize = 9,
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Text
      style={[
        {
          fontFamily: fontFamily[poppins],
          fontSize,
          color: darkMode === 'dark' ? 'white' : 'black',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});
