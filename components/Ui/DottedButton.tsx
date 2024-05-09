import { StyleSheet, View, Text, Pressable } from 'react-native';
import { MyText } from './MyText';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@/constants/Colors';
import { Button } from 'react-native-paper';
import { useDarkMode } from '@/hooks/useDarkMode';

type Props = {
  onPress: () => void;
  text: string;
  isIcon?: boolean;
};

export const DottedButton = ({
  onPress,
  text,
  isIcon = true,
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <Button
      style={{
        borderWidth: 1,
        borderColor: colors.gray10,
        borderRadius: 10,
        borderStyle: 'dashed',
        marginTop: 20,
      }}
      contentStyle={{ height: 50 }}
      icon={() =>
        isIcon && (
          <AntDesign
            name="plus"
            size={20}
            color={darkMode === 'dark' ? 'white' : 'dark'}
          />
        )
      }
      onPress={onPress}
      textColor={darkMode === 'dark' ? 'white' : 'dark'}
      labelStyle={{ fontFamily: 'PoppinsLight' }}
    >
      {text}
    </Button>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.gray10,
    padding: 10,
    borderRadius: 10,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
});
