import { colors } from '@/constants/Colors';
import { useDarkMode } from '@/hooks/useDarkMode';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

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
        flex: 1,
      }}
      contentStyle={{ height: 50 }}
      icon={() =>
        isIcon && (
          <AntDesign
            name="plus"
            size={20}
            color={darkMode === 'dark' ? 'white' : 'black'}
          />
        )
      }
      onPress={onPress}
      textColor={darkMode === 'dark' ? 'white' : 'black'}
      labelStyle={{ fontFamily: 'PoppinsLight' }}
    >
      {text}
    </Button>
  );
};
